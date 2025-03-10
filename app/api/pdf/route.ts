import { NextRequest, NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";
import pdfParse from "pdf-parse";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    // Read file as Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const parsedData = await pdfParse(fileBuffer);
    const extractedText = parsedData.text;

    // Send text to Google Gemini API
    const questions = await extractQuestionsWithGemini(extractedText);

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json({ success: false, message: "Failed to process the PDF" }, { status: 500 });
  }
}

async function extractQuestionsWithGemini(text: string) {
  try {
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        prompt: { text: `Extract multiple-choice questions (MCQs) from the following text:\n\n${text}` },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data?.candidates?.[0]?.content || [];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return [];
  }
}
