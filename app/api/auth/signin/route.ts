import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // Generate JWT token with `name` included
    const secret = process.env.JWT_SECRET || "your_secret_key";
    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.name,  // ✅ Add this
        email: user.email, 
        role: user.role, 
        profileImage: user.profileImage || "/default-avatar.png"
      }, 
      secret,
      { expiresIn: "7d" }
    );

    // Set cookie and send response
    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,  // ✅ Ensure `name` is sent in response
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "/default-avatar.png"
      }
    });

    response.cookies.set("token", token, { httpOnly: true, secure: true });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
