import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

// Google Gemini API Key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 🛑 Authentication Check
    const token = req.headers.get("Authorization");
    if (!token || token !== "Bearer mysecrettoken") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🛑 Get File Data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 🛑 Read File Content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    // 🛑 Convert File Content to Base64
    const base64Data = buffer.toString("base64");

    // 🛑 Send to Google Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      { inlineData: { mimeType: file.type, data: base64Data } },
    ]);

    // 🛑 Extracted Text
    const response = await result.response;
    const extractedText = response.text();

    return NextResponse.json({ message: "Text extracted successfully", text: extractedText });
  } catch (error) {
    console.error("Error extracting text:", error);
    return NextResponse.json({ error: "Text extraction failed" }, { status: 500 });
  }
}
