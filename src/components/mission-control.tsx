"use client";

import { useState } from "react";
import type { AgentRun, Scenario } from "@/lib/types";

export function MissionControl({ scenarios }: { scenarios: Scenario[] }) {
  const [selectedId, setSelectedId] = useState(scenarios[0].id);
  const [run, setRun] = useState<AgentRun | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scenario = scenarios.find((item) => item.id === selectedId) ?? scenarios[0];

  async function execute() {
    setIsRunning(true);
    setError(null);
    setRun(null);
    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: selectedId }),
      });
      if (!response.ok) throw new Error("The workflow could not be started.");
      setRun((await response.json()) as AgentRun);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unexpected workflow error");
    } finally {
      setIsRunning(false);
    }
  }

  function changeScenario(id: string) {
    setSelectedId(id);
    setRun(null);
    setError(null);
  }

  return (
    <div className="mission-control">
      <aside className="scenario-rail">
        <div className="rail-label">Select workflow</div>
        {scenarios.map((item, index) => (
          <button type="button" aria-pressed={item.id === selectedId} className={`scenario-button ${item.id === selectedId ? "active" : ""}`} key={item.id} onClick={() => changeScenario(item.id)}>
            <span>0{index + 1}</span><div><small>{item.eyebrow}</small><strong>{item.title}</strong></div>
          </button>
        ))}
        <div className="rail-note"><span>●</span><p><strong>No API key needed.</strong><br />Runs use deterministic fixtures so reviewers see the same result every time.</p></div>
      </aside>

      <div className="workspace">
        <div className="workspace-header">
          <div><span className={`risk risk-${scenario.risk}`}>{scenario.risk} risk</span><h3>{scenario.title}</h3><p>{scenario.summary}</p></div>
          <button type="button" className="run-button" onClick={execute} disabled={isRunning}>{isRunning ? "Running…" : "Run workflow"}<span aria-hidden="true">{isRunning ? "◌" : "▶"}</span></button>
        </div>

        <div className="goal-row"><span>Business goal</span><p>{scenario.businessGoal}</p></div>

        <div className="agent-graph" aria-label="Agent workflow">
          {["Orchestrator", "Retriever", "Specialist", "Risk reviewer", scenario.requiresApproval ? "Human approval" : "Synthesizer"].map((role, index) => (
            <div className="agent-node" key={role}><span>{index + 1}</span><strong>{role}</strong><small>{index === 0 ? "routes" : index === 1 ? "grounds" : index === 2 ? "reasons" : index === 3 ? "guards" : scenario.requiresApproval ? "authorizes" : "responds"}</small></div>
          ))}
        </div>

        {!run && !isRunning && !error && (
          <div className="empty-state"><div className="radar"><span /></div><h4>Ready to inspect</h4><p>Run the workflow to see the full trace, evidence, decision, and automated quality score.</p></div>
        )}
        {isRunning && <div className="empty-state running" role="status" aria-live="polite"><div className="radar"><span /></div><h4>Agents are working</h4><p>Retrieving evidence, evaluating actions, and constructing an auditable response.</p></div>}
        {error && <div className="error-state" role="alert"><strong>Run failed</strong><p>{error}</p><button type="button" onClick={execute}>Try again</button></div>}

        {run && (
          <div className="run-results" aria-live="polite">
            <div className="result-summary">
              <div><span className="result-label">Decision</span><h4>{run.decision}</h4><p>{run.explanation}</p></div>
              <div className={`score-ring ${run.evaluation.passed ? "pass" : "fail"}`}><strong>{Math.round(run.evaluation.overall * 100)}</strong><span>eval score</span></div>
            </div>

            {run.approval && <div className="approval-banner"><span>HUMAN GATE</span><div><strong>{run.approval.reason}</strong><p>{run.approval.safeDefault}</p></div><em>Approval requested</em></div>}

            <div className="result-grid">
              <section className="trace-panel"><div className="panel-title"><span>Execution trace</span><code>{run.runId}</code></div>{run.events.map((item) => (
                <div className="trace-item" key={item.id}><i /><div><div><strong>{item.role}</strong><span>{item.atMs}ms</span></div><h5>{item.action}</h5><p>{item.detail}</p>{item.tool && <code>tool: {item.tool}</code>}</div></div>
              ))}</section>
              <section className="evidence-panel"><div className="panel-title"><span>Grounding evidence</span><code>{run.evidence.length} sources</code></div>{run.evidence.map((item) => (
                <article className="evidence-item" key={item.id}><div><span>{item.id}</span><strong>{Math.round(item.relevance * 100)}% match</strong></div><h5>{item.source}</h5><p>“{item.excerpt}”</p></article>
              ))}</section>
            </div>
            <div className="telemetry-row">
              <div><span>Latency</span><strong>{(run.telemetry.latencyMs / 1000).toFixed(2)}s</strong></div>
              <div><span>Tool calls</span><strong>{run.telemetry.toolCalls}</strong></div>
              <div><span>Retries</span><strong>{run.telemetry.retries}</strong></div>
              <div><span>Est. cost</span><strong>${run.telemetry.estimatedCostUsd.toFixed(4)}</strong></div>
              <div><span>Policy</span><strong className="green">PASS</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
