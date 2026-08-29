---
title: "Fixing a type lie in Spotify's official TypeScript SDK"
description: "How a typing bug I hit as a user of Spotify's web-api-ts-sdk turned into a merged PR, and the TypeScript trick that made it possible."
date: "2026-08-22"
tags:
  - typescript
  - open-source
  - spotify
image: "/images/posts/spotify-sdk-search-types/cover-light.png"
imageDark: "/images/posts/spotify-sdk-search-types/cover-dark.png"
draft: false
---

For a while I was writing my own Spotify API client in TypeScript, around the same time
Spotify's own team was building their official one. The two ended up fairly close in shape -
which made sense, we were both wrapping the same API - but there's only one outcome when an
official SDK exists: people use the official one. Mine quietly stopped mattering the day
[`spotify-web-api-ts-sdk`][1] shipped, and that was fine. I switched my own project over to it
like everyone else.

Being a user of a library you almost wrote yourself is a strange position - you read the source
differently, you notice things faster. A few weeks in, I noticed something in the `search`
endpoint's types that was just wrong.

## The bug: the types promised more than the API delivers

Spotify's search endpoint takes a list of resource types to search across - `track`, `artist`,
`album`, and so on - and its own documentation is explicit about what comes back: **only the
keys you asked for are present in the response.** Search for tracks and artists, and you get
`tracks` and `artists` back. You do not get `albums: undefined` sitting in the payload for every
type you didn't ask for.

The SDK's typings disagreed. Every property on the search result type was declared as always
present:

```ts
interface SearchResults {
  tracks: Page<Track>
  artists: Page<Artist>
  albums: Page<SimplifiedAlbum>
  playlists: Page<PlaylistBase>
  shows: Page<SimplifiedShow>
  episodes: Page<SimplifiedEpisode>
  audiobooks: Page<SimplifiedAudiobook>
}
```

Which means TypeScript would happily let you write `result.albums.items` after searching for
`track` only, no error, no warning - and then hand you a runtime crash the moment that code
actually ran, because `albums` was never in the response to begin with. That's about the worst
kind of typing bug: it doesn't just fail to help, it actively lies to the compiler on your
behalf.

The fix sounds simple in one sentence: make every property optional. But that's not quite right
either, and this is the part that actually made the problem interesting.

## Why "just make it all optional" isn't good enough

If you search with a literal, fixed list of types - `search(q, ['track'])` - TypeScript *can*
know exactly what's coming back. In that case the type checker should be able to tell you
`result.tracks` is definitely there, no optional chaining needed. It's only when the list of
types isn't known at compile time - it's a `string[]` built at runtime, say - that the compiler
genuinely can't promise anything, and every property should be optional.

So the real requirement was: **make properties optional, except when TypeScript can statically
prove which ones will exist.** That's not a straightforward "add a `?` to everything" fix - it
needs the type to behave differently depending on whether the input is a fixed tuple or an open
array, decided entirely at the type level.

I wasn't sure this was even expressible in TypeScript's type system, so I asked on Stack
Overflow, worried it might not be feasible at all: [Typescript: Make all properties optional
unless explicited when using a literal type][2].

Twenty minutes later, [wonderflame][3] posted an answer that was, genuinely, one of the best
pieces of TypeScript explanation I've ever read on that site. It didn't just hand me a type - it
built the reasoning up from first principles, step by step. Enough that I could turn it directly
into a pull request. Here's that reasoning, laid out the way it earned it.

## The trick, step by step

### Step 1 — detect whether an array is a fixed tuple or an open array

The whole problem hinges on being able to distinguish two shapes that look similar at a glance
but aren't: a fixed-length tuple like `['track']` versus an open-ended array like `string[]`.
TypeScript exposes a way to tell them apart through the array's `length` property:

```ts twoslash
type Case1 = [1, 2, 3]["length"]
//   3

type Case2 = number[]["length"]
//   number
```

A tuple's `length` resolves to a literal number. An array's `length` resolves to the general
type `number`. That difference is exactly the hook we need - if `number` extends the array's
`length` type, it's not a tuple:

```ts twoslash
type IsTuple<T extends readonly unknown[]> =
  number extends T["length"] ? false : true
```

(`readonly` is there so this also matches `as const` tuples, which are a readonly supertype of
the mutable array.)

### Step 2 — make the search function generic over the exact input

Next, the function signature needs to capture the *specific* array that was passed in, not just
widen it to `ItemTypes[]`. That means a generic `const` type parameter (TypeScript 5.0+; a
`const` assertion at the call site achieves the same thing on older versions):

```ts twoslash
type ItemTypes = "track" | "artist" | "album"
// ---cut---
declare const search: <const T extends readonly ItemTypes[]>(
  types: T,
) => unknown //  ^ to be replaced below
```

### Step 3 — build the result type from the requested keys

With `T` captured, `T[number]` gives every individual element type in the array, which is enough
to `Pick` only the relevant keys out of a type where *everything* is optional by default:

```ts twoslash
type ItemTypes = "track" | "artist" | "album"
interface ResourceTypeToResultKey {
  track: "tracks"
  artist: "artists"
  album: "albums"
}
type SearchResults = {
  [K in ItemTypes as ResourceTypeToResultKey[K]]?: unknown
}
// ---cut---
type Result<T extends readonly ItemTypes[]> =
  Pick<SearchResults, ResourceTypeToResultKey[T[number]]>
```

### Step 4 — flip optional to required, only for tuples

Last piece: feed that `Pick` through `infer` so it can be reused, then branch on `IsTuple`.
Non-tuple input keeps the properties optional; tuple input gets wrapped in `Required<...>`:

```ts twoslash
type ItemTypes = "track" | "artist" | "album"
interface ResourceTypeToResultKey {
  track: "tracks"
  artist: "artists"
  album: "albums"
}
type SearchResults = {
  [K in ItemTypes as ResourceTypeToResultKey[K]]?: unknown
}
type IsTuple<T extends readonly unknown[]> =
  number extends T["length"] ? false : true
// ---cut---
type SearchResultsFor<T extends readonly ItemTypes[]> =
  Pick<SearchResults, ResourceTypeToResultKey[T[number]]> extends infer R
    ? IsTuple<T> extends false
      ? R
      : Required<R>
    : never

declare const search: <const T extends readonly ItemTypes[]>(
  types: T,
) => SearchResultsFor<T>

declare const dynamicTypes: ItemTypes[]
const case1 = search(dynamicTypes)
// { tracks?: Page<Track>, artists?: Page<Artist>, albums?: Page<SimplifiedAlbum> }

const case2 = search(["track"])
// { tracks: Page<Track> }
```

Search with a runtime-built array and `tracks` comes back optional, exactly matching what the
API can actually promise. Search with a literal tuple and TypeScript narrows it down to only the
keys you asked for, all required - no optional chaining needed, no lying to the compiler either
way.

## Turning it into a PR

The actual [PR to the SDK][4] was almost a direct transcription of that answer into the
codebase's real types - `SearchResults` became generic over the requested tuple, the endpoint's
`execute` signature got the `const T extends readonly ItemTypes[]` treatment, and I added two
type-level tests with `expectTypeOf` to lock the behavior in for both cases: one asserting
optional properties for a non-literal array, one asserting required properties for a literal
tuple.

Small diff - about fifty lines including tests - and it went through review cleanly. Merged not
long after.

## Wrap-up

I keep coming back to how this whole thing started: not by planning to contribute to Spotify's
SDK, just by using it for something of my own and tripping over a rough edge. That's most of my
open-source contributions in a sentence - fix the thing that's actually in your way, on the
library you actually use. And it's a good reminder that the best answer to "is this even
possible in TypeScript" is usually "ask, and find out" - because the type system can do more
than it looks like at first glance, and sometimes the answer is a small masterclass in disguise.                               |

[1]: https://github.com/spotify/spotify-web-api-ts-sdk
[2]: https://stackoverflow.com/questions/76551984/typescript-make-all-properties-optional-unless-explicited-when-using-a-literal
[3]: https://stackoverflow.com/users/21637817/wonderflame
[4]: https://github.com/spotify/spotify-web-api-ts-sdk/pull/66
