---
title: "Implementing Bluesky/AT Proto auth in nuxt-auth-utils: a new kind of authentication"
description: "Building the Bluesky/AT Proto provider for nuxt-auth-utils: why AT Proto breaks classic OAuth assumptions, and the design pivot the maintainer and I worked out live in the PR."
date: "2025-02-05"
tags:
  - open-source
  - nuxt
  - oauth
  - atproto
  - bluesky
image: "/images/posts/nuxt-auth-utils-bluesky/cover-light.png"
imageDark: "/images/posts/nuxt-auth-utils-bluesky/cover-dark.png"
draft: false
---

Most OAuth providers you add to an auth library are the same fifty lines with a different set of
URLs swapped in: an authorize endpoint, a token endpoint, a client ID, a client secret. Bluesky
wasn't that. Getting [this PR][1] right took a real back-and-forth with the maintainer, one honest
"I'm not satisfied with this" course-correction in the middle, a maintainer catching me almost
shipping a memory leak, and enough digging into the AT Proto spec to understand why a normal
OAuth integration just doesn't work here.

This is the writeup of that PR, and I wanted the actual discussion in it, not just the diff.
Half of what makes this one worth telling only shows up in the comments.

## Why this protocol exists in the first place

None of this would have been worth building if Bluesky hadn't gone from a niche invite-only beta
to a real destination almost overnight. That happened for reasons that are more about *why people
left Twitter/X* than about Bluesky itself:

- **The Twitter acquisition.** Once Twitter became X under new ownership, a chunk of its
  userbase (journalists, researchers, moderation-sensitive communities) started actively
  looking for somewhere else to be, not just complaining about the old place.
- **Algorithm opacity.** X's ranking became more opaque and, at times, openly editorial (boosted
  reach for the owner's own posts is the most visible example), which pushed people toward a
  platform that advertises transparent, swappable feed algorithms as a core feature rather than a
  black box.
- **The politics of the platform itself**, not just the content on it: moderation policy
  reversals, verification changes, and a general sense that a single company's decisions could
  reshape your reach and audience overnight.

Bluesky's answer to all three wasn't "trust us more," it was structural: **AT Proto** is built
so that your identity and your data aren't owned by any single company's server. You can
self-host your own account server, move providers without losing your identity or followers, and
no single company controls the whole network the way X controls X. That's the part that actually
broke OAuth's assumptions, and it's why this PR ended up being a lot more than "add a login
button."

Mastodon is the other name that comes up in the same breath as decentralized social, and it's
worth being precise about the comparison instead of waving at it, because the two aren't
decentralized in the same way. Mastodon's federation is real and in daily use: thousands of
independently run servers with their own moderation rules, genuinely talking to each other,
sometimes genuinely refusing to. AT Proto's is, for the most part, still theoretical. As of early
2026 something like 99% of AT Proto accounts live on Bluesky's own infrastructure, and most of
what's left is spam accounts. People actually running their own independent server are counted in
the tens of thousands, not millions. Bluesky talks about letting you leave without losing
anything as core to the design, and structurally it is, but almost nobody has actually left yet.

So why did Bluesky pull ahead of a network that's more decentralized in practice? Mostly UX and
timing, not architecture. Mastodon makes you pick a server before you understand why that choice
even matters, and that's a hard wall to put in front of someone who just wants to leave Twitter.
Bluesky put a single, familiar, Twitter-shaped app in front of people at the exact moment the
Twitter/X exodus needed somewhere to land, and asked nothing else of them up front. Looking like
Twitter won more users than being architecturally different from Twitter did.

Which raises the real question: if almost nobody self-hosts, why does any of this matter? Because
being able to leave isn't a feature you use day to day, it's insurance. Nobody wants to migrate
the way nobody wants to restore from a backup, right up until the day the company running their
identity gets acquired, changes its moderation policy, or shuts down. The value isn't in the
migrating, it's in the fact that the option exists at all. And for this post specifically, that's
not just a nice idea: it's the direct reason the OAuth flow had to be built the way it is. There's
no single company you always log into, because the whole point is that there doesn't have to be
one, and that's the thread the rest of this post pulls on.

## The problem OAuth doesn't have an answer for

Every OAuth provider `nuxt-auth-utils` already supported - GitHub, GitLab, Spotify, Google - has
one fixed issuer. You know the authorize URL and the token URL before the user has told you
anything about themselves, because there's exactly one GitHub.

Bluesky doesn't work that way, because it isn't really "Bluesky" underneath. It's one app built
on AT Proto, a network where a user's account can live on any compatible server, not just
Bluesky's own. So you can't know the authorize/token endpoints up front. You first need the
user's **handle**, figure out which server actually hosts their account, and only then can you
start something OAuth-shaped against that specific server.

Handling that resolution and verification by hand is enough work that I opted to lean on
`@atproto/oauth-client-node` and `@atproto/api` rather than reimplement it myself:

::pr-quote{author="Neil Richter" handle="noook" avatar="https://github.com/noook.png" role="Author" date="Nov 14, 2024" href="https://github.com/atinux/nuxt-auth-utils/pull/281" mine}
This PR adds Bluesky as a provider.

In order to begin the authorization process, we first need to know the user handle. This is
required because we need to know against which instance of Bluesky we need to verify the user.
Doing all the verifications manually require a lot of steps and adds complexity, so we use the
`atproto` API instead.
::

## The pivot: this isn't a Bluesky problem, it's an AT Proto problem

The first pass worked. It also bugged me, because I'd basically hardcoded "Bluesky" into
something that was really a generic protocol underneath, and AT Proto is explicitly meant to
host more than one app. If another AT Proto-based service showed up later, this provider would
need to be rebuilt from scratch instead of reused. I said as much a few days after the first
version landed:

::pr-quote{author="Neil Richter" handle="noook" avatar="https://github.com/noook.png" role="Author" date="Nov 14, 2024" href="https://github.com/atinux/nuxt-auth-utils/pull/281#issuecomment-2476068454" mine}
I'm not sure I'm satisfied regarding the current implementation. Basically Bluesky is just a
provider using atproto underneath, and we could have sooner or later another atproto provider.

So the configuration would be split into two parts:
- `atproto` -> next to `oauth` and `webauthn` configuration.
- `oauth.${atprotoProvider}` -> Should implement an interface such that matches the "Client ID
  Metadata Document" section on [this document](https://atproto.com/specs/oauth#clients) that
  seems to be a common base for future atproto providers
::

That's the moment the PR stopped being "add a login button" and became "model a provider family
that doesn't exist yet in this codebase." atinux's reply was immediate buy-in:

::pr-quote{author="Sébastien Chopin" handle="atinux" avatar="https://github.com/atinux.png" role="Maintainer" date="Nov 14, 2024" href="https://github.com/atinux/nuxt-auth-utils/pull/281#issuecomment-2476073379"}
I love this approach!
::

## Under the hood: what actually makes AT Proto's OAuth different

Once you get past "we need the handle first," a few things about how AT Proto handles login
don't look anything like normal OAuth. Here's the short version of each.

Normally you register your app once in a developer dashboard and get back a client ID that's
just a random string, and that's it forever. AT Proto skips the dashboard entirely: your app
publishes a small JSON file about itself somewhere public, and that file's URL becomes your
client ID. Every login, the server fetches it and checks the contents match. Think of it as a
name tag the bouncer rereads on the way in each time, rather than a membership card issued once.

Access tokens get tied to a key your app holds onto, using a mechanism called DPoP. A regular
bearer token works a bit like a hotel key card: whoever has a copy can use it. Here, copying the
token alone doesn't get you anywhere, you'd need the private key it was issued against too.

Then there's the handle itself. `@you.bsky.social` can change any time, so it can't be the real
identifier underneath. Before login even starts, the app resolves it to a DID, a stable ID that
survives a handle change or a server move, and the DID points at wherever the account actually
lives. That's the part carrying the real weight: only that server gets to vouch for the account,
so a compromised or malicious server elsewhere on the network can't just claim it.

And because the account's home server is different for every user, none of the OAuth endpoints
are fixed the way `github.com/login/oauth` is. A normal integration hardcodes those URLs once.
Here they get looked up fresh, every single login.

None of this exists to be clever. Every one of these pieces is there because a network without a
single central authority genuinely can't rely on "register once with the one company that runs
everything," which is the assumption that makes a normal OAuth integration simple in the first
place.

## The part that doesn't exist in classic OAuth: dynamic client metadata

Regular OAuth apps register their client ID once, by hand, in a developer dashboard, and that's
it forever. AT Proto instead expects your app to **serve a small file describing itself**, at the
exact URL the protocol treats as your client ID:

```json
// GET https://your-app.com/.well-known/oauth-client-metadata.json (illustrative)
{
  "client_id": "https://your-app.com/oauth-client-metadata.json",
  "client_name": "Your App",
  "redirect_uris": ["https://your-app.com/auth/bluesky"],
  "scope": "atproto"
}
```

Because that URL gets fetched live, and the app's actual redirect URL isn't known until someone
deploys the site, this can't be a static file checked into the repo. It has to be generated on
the fly, using whatever config the site is actually running with. That's the "new challenge"
from the comment above, and it became its own piece of work: an endpoint that builds this file
dynamically from the module's config.

```ts
// src/runtime/server/lib/oauth/bluesky.ts (simplified)
export function defineOAuthBlueskyEventHandler({ config, onSuccess, onError }: OAuthConfig<OAuthBlueskyConfig>) {
  return eventHandler(async (event: H3Event) => {
    const runtimeConfig = useRuntimeConfig(event).oauth?.bluesky
    const publicUrl = config?.publicUrl || runtimeConfig.publicUrl

    const client = await getBlueskyOAuthClient(event, {
      publicUrl,
      redirectURL: config?.redirectURL || runtimeConfig.redirectURL,
      scope: config?.scope,
      clientName: config?.clientName,
      clientUri: config?.clientUri,
    })

    // ...resolve handle, kick off the atproto authorize flow
  })
}
```

The metadata endpoint just mirrors that same config back out as JSON, on request, so it's always
consistent with whatever the app is actually running with, instead of a value someone typed into
a dashboard once and forgot about.

## A production lesson from the maintainer: don't assume memory sticks around

The first working version stored OAuth state and session data with `unstorage`, the same
key-value abstraction `nuxt-auth-utils` already used elsewhere. It worked fine locally. atinux
caught the problem before it shipped, and the point underneath his comment is one worth
stating plainly: Nuxt can run in a lot of different places, a regular Node server, Cloudflare
Workers, and plenty of other serverless environments, and the code has to work the same way
regardless of where it ends up. That means leaning on things that are available everywhere
(cookies, the request itself) instead of patterns that quietly assume there's one long-running
process holding state in memory between requests.

`useStorage` defaults to in-memory storage on a lot of targets unless you configure something
else, which is fine for a long-lived server but breaks on serverless, where a fresh instance can
handle the very next request with nothing remembered from the last one. An OAuth flow that
redirects out to Bluesky and back needs that in-between state to survive no matter where the app
is deployed, so relying on memory-by-default storage was the wrong call for a library meant to
run anywhere.

I came back to it later and reworked session/state storage to use signed cookies instead, no
shared storage dependency, same behavior on every deploy target:

```ts
// storing OAuth state in a cookie instead of unstorage
setCookie(event, 'nuxt-auth-atproto-state', JSON.stringify(state), {
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 60 * 10, // just long enough to complete the redirect round-trip
})
```

The code was already reworked to use cookies for state and session storage by this point; the
one thing still worth doing was deleting the session cookie right after it's read, since it's
dead weight once authentication finishes. That cleanup went in as a small follow-up, no drama
attached.

## The near-miss: a one-line "fix" that would have been a memory leak

Late in review, atinux suggested a small cleanup to deduplicate OAuth scopes:

```ts
// suggested
const scope = [...new Set(config.scope)].scope.join(' ')
```

It looked harmless, dedupe an array, join it back into a string, but it mutated the shared
module config object directly instead of working on a copy. Since that config gets read on every
incoming request, the "deduped" list would have quietly grown a little more on every request that
added a scope, forever, for as long as the server process stayed alive. I caught it before
merging:

::pr-quote{author="Neil Richter" handle="noook" avatar="https://github.com/noook.png" role="Author" date="Nov 14, 2024" href="https://github.com/atinux/nuxt-auth-utils/pull/281#discussion_r1842069022" mine}
I don't think this is the way, as of now it's currently causing a memory leak as every request
will add the configured scope to the list of scopes. I should configure the merge strategy of
`defu` instead
::

The actual fix was to stop mutating shared config altogether, and instead teach `defu` (the
deep-merge utility the module already uses to combine user config with defaults) to dedupe scopes
as part of the merge itself. That way every request gets a freshly computed result instead of a
shared value slowly accumulating state across requests.

## Shipping

[`#281`][1] merged on February 5, 2025, landing a generic `atproto` config block, dynamic client
metadata, cookie-based session storage, and docs for setting up AT Proto logins. A same-day
follow-up, [`#340`][2], fixed one more edge case in how sessions were mapped locally before the
dust settled.

## What I'd take from this one

The interesting part of contributing to open source is rarely the code you type. It's usually the
moment you stop and say "wait, this abstraction is wrong" in the middle of otherwise working
code, or the moment a maintainer with more production scars than you catches something you didn't
think to check. AT Proto forced both here: it doesn't fit the OAuth mental model cleanly, so
getting the shape right took an actual conversation, not just an implementation pass. That
conversation is the part I wanted to preserve, quotes and all, rather than flatten it down to
"added Bluesky login."

[0]: https://github.com/atinux/nuxt-auth-utils
[1]: https://github.com/atinux/nuxt-auth-utils/pull/281
[2]: https://github.com/atinux/nuxt-auth-utils/pull/340
