// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only PDF files are allowed." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const parsedData = await pdfParse(fileBuffer);

    const MAX_CHARS = 12000;
    const extractedText = parsedData.text.slice(0, MAX_CHARS);

    if (process.env.NODE_ENV !== "production") {
      console.log("Extracted text preview:", extractedText.slice(0, 500));
    }

    const questions = await extractQuestionsWithGemini(extractedText);

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process the PDF" },
      { status: 500 }
    );
  }
}

async function extractQuestionsWithGemini(text: string) {
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key");
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Extract multiple-choice questions from the following educational text.
Each question should have 4 options (a, b, c, d) and clearly indicate the correct answer.

Text:\n\n${text}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const geminiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return geminiResponse;
  } catch (error: any) {
    console.error(
      "Error calling Gemini API:",
      error?.response?.data || error.message || error
    );
    return "";
  }
}
