// Shared-element view transitions: giving an image/title the same
// view-transition-name on a listing card and on its detail page makes the
// browser morph between them on navigation instead of cross-fading the
// whole page. Names must be unique per currently-visible element, so
// callers key them by the content item's path.
//
// Support ('startViewTransition' in document) is only knowable
// client-side. Returning it from a ref that starts `false` and flips in
// onMounted keeps the client's *first* render (pre-hydration) matching
// the server's - the attribute is then added as a real post-hydration DOM
// patch instead of during hydration itself, which otherwise Vue flags as
// a hydration mismatch on every page load. This one composable replaces
// the same supportsViewTransitions ref + onMounted pair that used to be
// duplicated in blog.vue, posts/[...slug].vue, projects/index.vue, and
// projects/[...slug].vue.
export function useViewTransitionName() {
  const supportsViewTransitions = ref(false)
  onMounted(() => {
    supportsViewTransitions.value = 'startViewTransition' in document
  })

  function transitionStyle(prefix: string, path: string) {
    return supportsViewTransitions.value
      ? { viewTransitionName: `${prefix}-${path.replace(/\//g, '-')}` }
      : undefined
  }

  return { supportsViewTransitions, transitionStyle }
}
