---
title: "Bluesky doesn't fit OAuth, so I helped teach nuxt-auth-utils AT Protocol instead"
description: "Building the Bluesky provider for nuxt-auth-utils: why AT Protocol breaks classic OAuth assumptions, and the design pivot the maintainer and I worked out live in the PR."
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

Most OAuth providers you add to an auth library are the same fifty lines with different URLs
swapped in: an authorize endpoint, a token endpoint, a client ID, a client secret. I've added a
few of those to [`nuxt-auth-utils`][0] before and they're a non-event. Bluesky was not one of
those fifty-line PRs. It took [24 commits over about three months][1], one honest "I'm not
satisfied with this" course-correction in the middle, a maintainer catching me almost shipping a
memory leak, and a fair amount of reading the AT Protocol spec to understand why the classic
OAuth shape doesn't apply here at all.

This is the writeup of that PR - and I wanted the actual discussion in it, not just the diff.
Half of what makes this one worth telling is visible only in the comments.

## The problem OAuth doesn't have an answer for

Every OAuth provider `nuxt-auth-utils` already supported - GitHub, GitLab, Spotify, Google - has
one fixed issuer. You know the authorize URL and the token URL before the user has told you
anything about themselves, because there's exactly one GitHub.

Bluesky doesn't work that way, because it isn't really "Bluesky" underneath - it's one client
of the AT Protocol, a federated network where a user's account can live on any compliant server
(a "PDS", Personal Data Server), not just Bluesky's own. That means you can't know the
authorize/token endpoints up front. You first need the user's **handle**, resolve which PDS
instance actually hosts their account, and only then can you kick off an OAuth-shaped flow
against that specific instance.

Handling that resolution and verification by hand is enough work that I opted to lean on
`@atproto/oauth-client-node` and `@atproto/api` rather than reimplement it, which is how I framed
it in the PR description:

::pr-quote{author="Neil Richter" handle="noook" avatar="https://github.com/noook.png" role="Author" date="Nov 14, 2024" href="https://github.com/atinux/nuxt-auth-utils/pull/281" mine}
Resolves: [#267](https://github.com/atinux/nuxt-auth-utils/issues/267)

This PR adds Bluesky as a provider.

This provider requires the user to install extra dependencies to properly handle authorization,
because of the way Bluesky works.

In order to begin the authorization process, we first need to know the user handle. This is
required because we need to know against which instance of Bluesky we need to verify the user.
Doing all the verifications manually require a lot of steps and adds complexity, so we use the
`atproto` API instead.
::

## The pivot: this isn't a Bluesky problem, it's an AT Proto problem

The first pass worked. It also bugged me, because I'd basically hardcoded "Bluesky" into
something that was really a generic protocol underneath - and AT Protocol is explicitly meant to
host more than one service. If another AT Proto-based app showed up later, this whole provider
would need to be rebuilt from scratch instead of reused. I said as much mid-PR, three days after
the first version landed:

::pr-quote{author="Neil Richter" handle="noook" avatar="https://github.com/noook.png" role="Author" date="Nov 14, 2024" href="https://github.com/atinux/nuxt-auth-utils/pull/281#issuecomment-2476068454" mine}
I'm not sure I'm satisfied regarding the current implementation. Basically Bluesky is just a
provider using atproto underneath, and we could have sooner or later another atproto provider.

I think I'm facing the same issues that come with the complexity of providing a generic OIDC
provider, but with the additional build time constraints on top of that (exposing the discovery
document)

So the configuration would be split into two parts:
- `atproto` -> next to `oauth` and `webauthn` configuration. Probably a boolean, so we can check
  that the peer dependencies are installed.
- `oauth.${atprotoProvider}` -> Should implement an interface such that matches the "Client ID
  Metadata Document" section on [this document](https://atproto.com/specs/oauth#clients) that
  seems to be a common base for future atproto providers

I guess the new challenge here is to provide the dynamic metadata handler
::

That's the moment the PR stops being "add a login button" and becomes "model a provider family
that doesn't exist yet in this codebase." atinux's reply was immediate buy-in:

::pr-quote{author="Sébastien Chopin" handle="atinux" avatar="https://github.com/atinux.png" role="Maintainer" date="Nov 14, 2024" href="https://github.com/atinux/nuxt-auth-utils/pull/281#issuecomment-2476073379"}
I love this approach!
::

## The part that doesn't exist in classic OAuth: dynamic client metadata

Regular OAuth apps register their client ID once, by hand, in a developer dashboard, and that's
it forever. AT Protocol instead expects your app to **serve a metadata document describing
itself**, at a URL the protocol treats as your client ID:

```json
// GET https://your-app.com/.well-known/oauth-client-metadata.json (illustrative)
{
  "client_id": "https://your-app.com/oauth-client-metadata.json",
  "client_name": "Your App",
  "redirect_uris": ["https://your-app.com/auth/bluesky"],
  "scope": "atproto"
}
```

Because the client ID *is* a URL that gets fetched, and the redirect URL/app URL aren't known
until someone actually deploys the site, this can't be a static file checked into the repo - it
has to be generated at request time from the running config. That's the "new challenge" flagged
in the comment above, and it became its own commit, wiring an event handler that serves the
metadata document dynamically from the module's config:

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

The metadata endpoint itself just mirrors that same config back out as JSON, on demand, so it's
always consistent with whatever `publicUrl`/`redirectURL` the app is actually running with -
instead of a value someone typed into a dashboard once and forgot about.

## A production lesson from the maintainer: don't trust serverless storage

The first working version stored OAuth state and session data with `unstorage`, the same
key-value abstraction `nuxt-auth-utils` already used elsewhere. It worked locally. atinux caught
the problem before it shipped:

::pr-quote{author="Sébastien Chopin" handle="atinux" avatar="https://github.com/atinux.png" role="Maintainer" date="Nov 28, 2024" href="https://github.com/atinux/nuxt-auth-utils/pull/281#issuecomment-2506326831"}
I just noticed that you use `useStorage` which can be tricky as it needs to be configured in
serverless environment in order to properly work. One solution could be to use cookies to store
the state, see [pilcrowonpaper/atproto-oauth-example](https://github.com/pilcrowonpaper/atproto-oauth-example/blob/2ebfd7836b5ce9921df31e66fb332ee8ae8d5823/src/pages/login/callback.ts#L15-L17)
::

`useStorage` defaults to in-memory on a lot of deploy targets, which is fine for a long-lived
Node server and silently broken on serverless/edge, where every request can land on a fresh
instance with nothing remembered from the last one. An OAuth flow that spans a redirect to
Bluesky and back needs that state to survive between requests no matter where it's deployed, so
in-memory-by-default storage was the wrong default for a library meant to run anywhere.

I came back to it over a month later and reworked session/state storage to use signed cookies
instead - no shared storage dependency, works identically on every deploy target:

```ts
// storing OAuth state in a cookie instead of unstorage
setCookie(event, 'nuxt-auth-atproto-state', JSON.stringify(state), {
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 60 * 10, // just long enough to complete the redirect round-trip
})
```

and proposed cleaning up after ourselves once the flow completes:

::pr-quote{author="Neil Richter" handle="noook" avatar="https://github.com/noook.png" role="Author" date="Jan 24, 2025" href="https://github.com/atinux/nuxt-auth-utils/pull/281#issuecomment-2612677906" mine}
Sorry, been away for a long time @atinux. I updated the code so that it uses cookies for storing
state and session. I think we could delete the session once it's read, as it's not longer used
after authentication, wdyt ?
::

::pr-quote{author="Sébastien Chopin" handle="atinux" avatar="https://github.com/atinux.png" role="Maintainer" date="Jan 30, 2025" href="https://github.com/atinux/nuxt-auth-utils/pull/281#issuecomment-2624217112"}
Agree! Happy to do it and fix the conflicts? 🙏

Don't apologize, it's open source, no hurry at all :D
::

## The near-miss: a one-line "fix" that would have been a memory leak

Late in review, atinux suggested a small cleanup to deduplicate OAuth scopes using a GitHub
suggested-change diff:

```ts
// suggested
const scope = [...new Set(config.scope)].scope.join(' ')
```

It looked harmless - dedupe an array, join it back into a string - but it operated on the shared
module config object, not a local copy. Since that config gets read on every incoming request,
mutating it in place would mean the "deduped" scope list quietly grew on every request that
happened to add a scope, forever, for the lifetime of the server process. I caught it before
merging:

::pr-quote{author="Neil Richter" handle="noook" avatar="https://github.com/noook.png" role="Author" date="Nov 14, 2024" href="https://github.com/atinux/nuxt-auth-utils/pull/281#discussion_r1842069022" mine}
I don't think this is the way, as of now it's currently causing a memory leak as every request
will add the configured scope to the list of scopes. I should configure the merge strategy of
`defu` instead
::

The actual fix was to stop mutating shared config altogether and instead teach `defu` - the
deep-merge utility the module already uses for combining user config with defaults - to dedupe
scopes as part of the merge itself, so every request gets a freshly computed result instead of
a shared mutable one accumulating state across requests.

## Shipping, and the same-day follow-up

`#281` merged on February 5, 2025 - 24 commits, spanning mid-November to early February, plus a
generic `atproto` config block, dynamic client metadata, cookie-based session storage, and full
docs for setting up AT Proto socials. A same-day follow-up, [`#340`][2], fixed one more edge case
in how sessions were mapped locally before the dust settled.

## What I'd take from this one

The interesting part of contributing to open source is rarely the code you type - it's the
moments where you stop and say "wait, this abstraction is wrong" in the middle of otherwise
working code, and the moments a maintainer with more production scars than you catches something
you didn't think to check. AT Protocol forced both of those here: it doesn't fit the OAuth
mental model cleanly, so getting the abstraction right took an actual design conversation, not
just an implementation pass. That conversation is the part I wanted to preserve, quotes and all,
rather than flatten it down to "added Bluesky login."

[0]: https://github.com/atinux/nuxt-auth-utils
[1]: https://github.com/atinux/nuxt-auth-utils/pull/281
[2]: https://github.com/atinux/nuxt-auth-utils/pull/340
