import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/oauth"];

const REDIREDT_TO_WHEN_NOT_AUTH = "sign-in";
const REDIREDT_TO_WHEN_ALREADY_AUTH = "/cloud";

export const middleware = (request: NextRequest) => {
  const pathName = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(pathName);
  const isRouteInAuth =
    pathName.includes("sign-in") ||
    pathName.includes("sign-up") ||
    pathName.includes("oauth");

  const auth = request.cookies.get("appwrite-session");

  if (!isPublicRoute && !auth) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIREDT_TO_WHEN_NOT_AUTH;
    return NextResponse.redirect(redirectUrl);
  }

  if (isRouteInAuth && auth) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIREDT_TO_WHEN_ALREADY_AUTH;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
};

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|assets/|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
