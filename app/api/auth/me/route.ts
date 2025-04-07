import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    console.log("Token Received:", token); // Debugging

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || "your_secret_key";
    const decoded = jwt.verify(token, secret) as JwtPayload;

    console.log("Decoded User:", decoded); // Debugging

    return NextResponse.json({ 
      id: decoded.id, 
      name: decoded.name || "Unknown User",  // ✅ Ensure `name` is sent
      email: decoded.email, 
      role: decoded.role, 
      profileImage: decoded.profileImage || "/default-avatar.png" 
    });

  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
