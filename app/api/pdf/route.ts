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

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);

    const MAX_LENGTH = 12000;
    const extractedText = parsed.text.slice(0, MAX_LENGTH);

    if (process.env.NODE_ENV !== "production") {
      console.log("📝 Extracted text preview:\n", extractedText.slice(0, 300));
    }

    const questions = await extractQuestionsWithGemini(extractedText);

    if (!questions) {
      return NextResponse.json(
        { success: false, message: "Gemini API did not return questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, questions }, { status: 200 });
  } catch (error) {
    console.error("❌ Error processing PDF:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process the PDF" },
      { status: 500 }
    );
  }
}

async function extractQuestionsWithGemini(text: string): Promise<string> {
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key");
  }

  try {
    const res = await axios.post(
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

    return (
      res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""
    );
  } catch (error: any) {
    console.error(
      "❌ Gemini API Error:",
      error?.response?.data || error.message
    );
    return "";
  }
}
