import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" || path === "/signUp" || path === "/forgotPassword";

  const token = request.cookies.get("accessToken")?.value || "";
  console.log("PATH:", path);
  console.log("TOKEN:", token);
  console.log("ALL COOKIES:", request.cookies.getAll());

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // ✅ Allow request
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/signUp",
    "/forgotPassword",
    "/showAllPasswords",
    "/me",
    "/generatePassword",
    "/changeUserDetails",
    "/changePassword",
  ],
};
