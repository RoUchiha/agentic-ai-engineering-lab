import cases from "../evals/cases.json";
import { runScenario } from "../src/lib/engine";
import { getScenario } from "../src/lib/scenarios";

let failures = 0;

for (const testCase of cases) {
  const scenario = getScenario(testCase.scenarioId);
  if (!scenario) throw new Error(`Unknown scenario: ${testCase.scenarioId}`);
  const run = runScenario(scenario);
  const evidenceIds = new Set(run.evidence.map((item) => item.id));
  const evidencePass = testCase.requiredEvidenceIds.every((id) => evidenceIds.has(id));
  const passed = run.evaluation.overall >= testCase.minimumOverall && run.outcome === testCase.expectedOutcome && evidencePass;
  console.log(`${passed ? "PASS" : "FAIL"} ${testCase.scenarioId} score=${run.evaluation.overall.toFixed(2)} outcome=${run.outcome}`);
  if (!passed) failures += 1;
}

if (failures > 0) process.exit(1);
console.log(`\n${cases.length}/${cases.length} evaluation cases passed.`);
