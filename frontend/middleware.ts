import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/sso-callback(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/data-deletion(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: [
    // Match all routes except static files and Next internals.
    '/((?!_next|.*\\..*).*)'
  ]
};
