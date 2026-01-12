import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Temporarily disable Redis-dependent middleware to fix startup issues
// import { createApiGateway } from "./lib/middleware/api-gateway";
// import { createRateLimitingMiddleware } from "./lib/middleware/rate-limiting";
// import { createRequestValidationMiddleware } from "./lib/middleware/request-validation";
// import { createApiAuthMiddleware } from "./lib/middleware/api-auth";

// Initialize middleware components
// const apiGateway = createApiGateway();
// const rateLimiter = createRateLimitingMiddleware();
// const requestValidator = createRequestValidationMiddleware();
// const apiAuth = createApiAuthMiddleware();

// Paths that don't require authentication
const publicPaths = [
  "/auth/signin",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/api/auth/**",
  "/api/v1/auth/**",
];

// Paths that are only accessible to admins
const adminPaths = [
  "/admin",
  "/admin/**",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle API requests with enhanced middleware stack
  if (pathname.startsWith('/api/')) {
    // Temporarily disabled Redis-dependent middleware
    // TODO: Re-enable after Redis setup
    
    // 1. API authentication (validate API keys)
    // const authResponse = await apiAuth.processRequest(request);
    // if (authResponse) {
    //   return authResponse;
    // }

    // 2. Rate limiting (after authentication)
    // const rateLimitResponse = await rateLimiter.processRequest(request);
    // if (rateLimitResponse) {
    //   return rateLimitResponse;
    // }

    // 3. Request validation
    // const validationResponse = await requestValidator.validateRequest(request);
    // if (validationResponse) {
    //   return validationResponse;
    // }

    // 4. API versioning and routing
    // const apiResponse = await apiGateway.handleRequest(request);
    // if (apiResponse) {
    //   return apiResponse;
    // }
  }
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    path === pathname || 
    (path.endsWith("/**") && pathname.startsWith(path.slice(0, -3)))
  );

  // Skip middleware for public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // Check if the path is admin-only
  const isAdminPath = adminPaths.some(path => 
    path === pathname || 
    (path.endsWith("/**") && pathname.startsWith(path.slice(0, -3)))
  );

  // Check if user has admin role
  if (isAdminPath && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
