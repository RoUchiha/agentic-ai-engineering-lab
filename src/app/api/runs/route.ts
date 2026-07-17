import { NextResponse } from "next/server";
import { z } from "zod";
import { runScenario } from "@/lib/engine";
import { getScenario } from "@/lib/scenarios";

const requestSchema = z.object({ scenarioId: z.string().min(1) });

export async function POST(request: Request) {
  const startedAt = performance.now();
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  try {
    const input = requestSchema.parse(await request.json());
    console.info(JSON.stringify({ event: "agent.run.started", requestId, scenarioId: input.scenarioId }));
    const scenario = getScenario(input.scenarioId);
    if (!scenario) {
      console.warn(JSON.stringify({ event: "agent.run.rejected", requestId, reason: "unknown_scenario" }));
      return NextResponse.json({ error: "Unknown scenario" }, { status: 404 });
    }
    const result = runScenario(scenario);
    console.info(JSON.stringify({
      event: "agent.run.completed",
      requestId,
      scenarioId: input.scenarioId,
      outcome: result.outcome,
      evaluationScore: result.evaluation.overall,
      durationMs: Math.round(performance.now() - startedAt),
    }));
    return NextResponse.json(result, { headers: { "x-request-id": requestId } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(JSON.stringify({ event: "agent.run.rejected", requestId, reason: "invalid_request" }));
      return NextResponse.json({ error: "Invalid request", issues: error.issues }, { status: 400 });
    }
    console.error(JSON.stringify({ event: "agent.run.failed", requestId, errorType: "internal_error" }));
    return NextResponse.json({ error: "Unable to execute workflow" }, { status: 500 });
  }
}
