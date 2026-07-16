import { NextResponse } from "next/server";
import { z } from "zod";
import { runScenario } from "@/lib/engine";
import { getScenario } from "@/lib/scenarios";

const requestSchema = z.object({ scenarioId: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const input = requestSchema.parse(await request.json());
    const scenario = getScenario(input.scenarioId);
    if (!scenario) return NextResponse.json({ error: "Unknown scenario" }, { status: 404 });
    return NextResponse.json(runScenario(scenario));
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid request", issues: error.issues }, { status: 400 });
    return NextResponse.json({ error: "Unable to execute workflow" }, { status: 500 });
  }
}
