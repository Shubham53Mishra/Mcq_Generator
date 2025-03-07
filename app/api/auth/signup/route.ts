import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import { connectDB } from "@/lib/connectDB"

export async function POST(req: Request) {
  try {
    await connectDB()

    // Log request body for debugging
    const body = await req.json()
    console.log("Received body:", body)  

    const { name, email, password, role } = body

    // Validate input
    if (!name || !email || !password || !role) {
      console.log("⚠️ Missing fields:", { name, email, password, role })
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check for existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log("⚠️ User already exists:", email)
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ name, email, password: hashedPassword, role })

    console.log("✅ User registered successfully:", newUser)

    return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 })
  } catch (error) {
    console.error("❌ Signup Error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
