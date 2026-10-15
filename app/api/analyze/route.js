import { NextResponse } from "next/server";
import { runFullAnalysis } from "@/backend/lib/analyze";

export function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/analyze",
    methods: ["POST"],
    message: "Use POST with JSON body: { prompt, output }",
  });
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET,POST,OPTIONS",
    },
  });
}

export async function POST(request) {
  try {
    const { prompt, output } = await request.json();

    // Validate inputs
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Prompt must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (!output || typeof output !== "string" || output.trim().length < 5) {
      return NextResponse.json(
        { error: "Output must be at least 5 characters" },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Run analysis
    const results = await runFullAnalysis(prompt, output);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
