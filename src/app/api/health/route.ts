import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "agentic-systems-lab",
    defaultMode: "deterministic",
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    checks: { runtime: "pass", scenarios: 3, evaluations: "enabled", policyGate: "enabled" },
  });
}
