import { MissionControl } from "@/components/mission-control";
import { scenarios } from "@/lib/scenarios";

const coverage = [
  ["01", "Orchestration", "Stateful routing, specialist handoffs, bounded loops"],
  ["02", "Grounding", "Hybrid retrieval, versioned evidence, citation checks"],
  ["03", "Safety", "Tool allowlists, policy gates, human approval"],
  ["04", "Evaluation", "Golden cases, regression thresholds, failure analysis"],
  ["05", "Operations", "Tracing, token cost, latency, retries, audit logs"],
  ["06", "Delivery", "Typed APIs, tests, CI, containers, documentation"],
];

const observabilityProjects = [
  {
    index: "01",
    title: "Agent SLO Command Center",
    summary: "Tracks whether agent workflows are available, fast, and staying inside their error budget.",
    metrics: ["Success rate", "p95 latency", "Error-budget burn", "Approval depth"],
    query: "histogram_quantile(0.95, rate(agent_run_duration_seconds_bucket[5m]))",
  },
  {
    index: "02",
    title: "Cost-Quality Correlator",
    summary: "Puts model spend, token volume, and evaluation quality together so routing trade-offs are visible.",
    metrics: ["Cost / run", "Mean quality", "Token rate", "Quality / dollar"],
    query: "rate(llm_estimated_cost_usd_total[5m]) / rate(agent_runs_total[5m])",
  },
  {
    index: "03",
    title: "Tool Reliability Lab",
    summary: "Shows which tools fail, slow down, or retry most often before they degrade the full agent workflow.",
    metrics: ["Tool success", "Tool p95", "Retry rate", "Failure share"],
    query: "sum by (tool, status) (rate(agent_tool_calls_total[5m]))",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Agentic Systems Lab home">
          <span className="brand-mark">AS</span>
          <span>Agentic Systems Lab</span>
        </a>
        <div className="nav-links">
          <a href="#lab">Live lab</a>
          <a href="#observability">Grafana</a>
          <a href="#coverage">Skills</a>
          <a href="https://github.com/RoUchiha" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </nav>

      <header className="hero shell" id="top">
        <div className="hero-copy">
          <div className="kicker"><span /> Production-minded AI engineering portfolio</div>
          <h1>Agents that can be<br /><em>trusted to act.</em></h1>
          <p className="hero-lede">A runnable reference system showing how I design, evaluate, and operate agentic AI for high-stakes enterprise workflows—not just how I call an LLM.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#lab">Run a workflow <span>↓</span></a>
            <a className="button button-ghost" href="/api/health">Inspect API <span>↗</span></a>
          </div>
        </div>
        <div className="hero-console" aria-label="Agent execution summary">
          <div className="console-top"><span>run.preview</span><span className="live-dot">LOCAL</span></div>
          <pre><code><span className="muted">01</span>  <span className="blue">orchestrator</span>.route(input){"\n"}<span className="muted">02</span>  ├─ <span className="violet">retriever</span>.search(policy_index){"\n"}<span className="muted">03</span>  ├─ <span className="yellow">specialist</span>.analyze(evidence){"\n"}<span className="muted">04</span>  ├─ <span className="orange">risk</span>.evaluate(action){"\n"}<span className="muted">05</span>  └─ <span className="green">human</span>.approve(write){"\n\n"}<span className="muted">status</span>  <span className="green">safe_to_proceed</span>{"\n"}<span className="muted">trace</span>   run_83eaf24c10</code></pre>
          <div className="console-metrics">
            <div><strong>0</strong><span>uncited claims</span></div>
            <div><strong>100%</strong><span>policy pass</span></div>
            <div><strong>1.26s</strong><span>latency</span></div>
          </div>
        </div>
      </header>

      <section className="proof-strip">
        <div className="shell proof-grid">
          <div><strong>3</strong><span>enterprise workflows</span></div>
          <div><strong>5</strong><span>cooperating agent roles</span></div>
          <div><strong>4</strong><span>automated quality gates</span></div>
          <div><strong>$0</strong><span>required to run locally</span></div>
        </div>
      </section>

      <section className="lab-section shell" id="lab">
        <div className="section-heading">
          <div><span className="section-index">01 / LIVE SYSTEM</span><h2>Mission control</h2></div>
          <p>Choose a business scenario and inspect every decision, tool call, policy gate, citation, and evaluation score.</p>
        </div>
        <MissionControl scenarios={scenarios} />
      </section>

      <section className="coverage-section shell" id="coverage">
        <div className="section-heading">
          <div><span className="section-index">02 / CAPABILITY MAP</span><h2>What this proves</h2></div>
          <p>Each capability is implemented in code, exercised by a workflow, and explained in plain language in the repository.</p>
        </div>
        <div className="coverage-grid">
          {coverage.map(([index, title, body]) => (
            <article className="coverage-card" key={index}>
              <span>{index}</span><h3>{title}</h3><p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="observability-section shell" id="observability">
        <div className="section-heading">
          <div><span className="section-index">03 / OBSERVABILITY LAB</span><h2>Three Grafana projects</h2></div>
          <p>Each dashboard is provisioned from source control, backed by real Prometheus metrics, and paired with alert rules and synthetic traffic for a one-command demo.</p>
        </div>
        <div className="observability-grid">
          {observabilityProjects.map((project) => (
            <article className="observability-card" key={project.index}>
              <div className="observability-card-top"><span>{project.index}</span><em>Grafana + Prometheus</em></div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <ul>{project.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul>
              <code>{project.query}</code>
            </article>
          ))}
        </div>
        <div className="observability-flow" aria-label="Observability data flow">
          <span>FastAPI /metrics</span><i>-&gt;</i><span>Prometheus scrape</span><i>-&gt;</i><span>PromQL</span><i>-&gt;</i><span>Grafana + alerts</span>
        </div>
      </section>

      <section className="architecture shell">
        <div className="section-heading compact">
          <div><span className="section-index">04 / SYSTEM MAP</span><h2>How the parts connect</h2></div>
        </div>
        <div className="system-map">
          {["Business request", "Agent graph", "Guarded tools", "Evidence + memory", "Evaluators", "Trace + audit"].map((item, index) => (
            <div className="map-node" key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < 5 && <i>→</i>}</div>
          ))}
        </div>
        <p className="map-caption">The model proposes. Typed tools constrain. Policy decides. Humans approve high-impact actions. Evaluators and traces make quality visible.</p>
      </section>

      <footer className="footer shell">
        <div><span className="brand-mark">AS</span><strong>Agentic Systems Lab</strong></div>
        <p>Built as inspectable engineering evidence. All business data is synthetic.</p>
      </footer>
    </main>
  );
}
