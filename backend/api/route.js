import { NextResponse } from "next/server";
import { runFullAnalysis } from "@/backend/lib/analyze";

export async function POST(request) {
  try {
    const { prompt, output } = await request.json();

    // Validate inputs
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid user prompt (at least 5 characters)." },
        { status: 400 }
      );
    }
    if (!output || typeof output !== "string" || output.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid AI output (at least 5 characters)." },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
      return NextResponse.json(
        { error: "Groq API key not configured. Please add your key to .env.local" },
        { status: 500 }
      );
    }

    // Call backend orchestrator
    const response = await runFullAnalysis(prompt, output);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze. Please try again." },
      { status: 500 }
    );
  }
}
