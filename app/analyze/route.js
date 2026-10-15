import { NextResponse } from "next/server";
import { runFullAnalysis } from "@/backend/lib/analyze";

export function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/analyze",
    compatibility: true,
    message: "Legacy endpoint. Prefer /api/analyze.",
    methods: ["POST"],
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
    const body = await request.json();
    const prompt =
      typeof body?.prompt === "string" && body.prompt.trim().length >= 5
        ? body.prompt.trim()
        : "Evaluate this AI assistant response for factual risk, hallucinations, and bias.";

    const outputCandidate =
      typeof body?.output === "string"
        ? body.output
        : typeof body?.text === "string"
          ? body.text
          : "";

    const output = outputCandidate.trim();

    if (output.length < 5) {
      return NextResponse.json(
        { error: "Output must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const results = await runFullAnalysis(prompt, output);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
