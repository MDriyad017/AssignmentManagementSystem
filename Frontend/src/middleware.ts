import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
    "/admin",
    "/teacher",
    "/student"
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken =
        request.cookies.get("access_token")?.value;

    const isProtectedRoute = protectedRoutes.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute && !accessToken) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.css$|.*\\.svg$).*)"
    ]
};