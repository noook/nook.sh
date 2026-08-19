// Redirects www.nook.sh -> nook.sh (apex).
//
// Both hostnames are bound as Cloudflare Workers custom domains to this
// same Worker, so an app-level redirect is the mechanism here rather than
// a Cloudflare Redirect Rule (the API token used for the DNS/domain setup
// only had Zone:DNS:Edit scope, not the rulesets permission Redirect
// Rules need - this achieves the same outcome without a broader token).
export default defineEventHandler((event) => {
  const host = getRequestHeader(event, 'host')
  if (host === 'www.nook.sh') {
    const url = getRequestURL(event)
    return sendRedirect(event, `https://nook.sh${url.pathname}${url.search}`, 301)
  }
})
