import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";

  // Agar token nahi hai toh login page pe redirect karein
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Agar user admin hai toh dashboard pe bhejo
  const { role } = JSON.parse(atob(token.split(".")[1])); // Decode JWT
  if (req.nextUrl.pathname === "/login" && role === "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login"], // In routes pe middleware chalega
};
