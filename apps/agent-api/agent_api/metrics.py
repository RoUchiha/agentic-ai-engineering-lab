from prometheus_client import Counter, Gauge, Histogram


RUNS = Counter(
    "agent_runs_total",
    "Completed agent runs by workflow outcome.",
    ("scenario", "outcome", "model"),
)
RUN_DURATION = Histogram(
    "agent_run_duration_seconds",
    "End-to-end agent run duration in seconds.",
    ("scenario", "model"),
    buckets=(0.05, 0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.5, 5.0, 10.0),
)
QUALITY_SCORE = Histogram(
    "agent_quality_score",
    "Offline or inline evaluation score from zero to one.",
    ("scenario", "model"),
    buckets=(0.5, 0.65, 0.75, 0.8, 0.85, 0.9, 0.95, 0.98, 1.0),
)
POLICY_DECISIONS = Counter(
    "agent_policy_decisions_total",
    "Policy outcomes applied before an agent action.",
    ("scenario", "decision"),
)
APPROVAL_QUEUE_DEPTH = Gauge(
    "agent_approval_queue_depth",
    "Current approval items waiting in a named queue.",
    ("queue",),
)
ACTIVE_RUNS = Gauge(
    "agent_active_runs",
    "Agent runs currently executing.",
    ("scenario",),
)
TOKENS = Counter(
    "llm_tokens_total",
    "LLM tokens consumed by direction.",
    ("scenario", "model", "direction"),
)
ESTIMATED_COST = Counter(
    "llm_estimated_cost_usd_total",
    "Estimated model cost in US dollars.",
    ("scenario", "model"),
)
TOOL_CALLS = Counter(
    "agent_tool_calls_total",
    "Agent tool calls by result status.",
    ("tool", "status"),
)
TOOL_DURATION = Histogram(
    "agent_tool_duration_seconds",
    "Agent tool execution duration in seconds.",
    ("tool",),
    buckets=(0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0),
)
RETRIES = Counter(
    "agent_retries_total",
    "Agent tool retries by bounded reason.",
    ("tool", "reason"),
)


def record_run(
    *,
    scenario: str,
    model: str,
    outcome: str,
    duration_seconds: float,
    quality_score: float,
    policy_decision: str,
    tool: str,
    tool_status: str,
    tool_duration_seconds: float,
    input_tokens: int,
    output_tokens: int,
    estimated_cost_usd: float,
    retries: int,
) -> None:
    """Record one bounded metric set with low-cardinality labels."""
    RUNS.labels(scenario=scenario, outcome=outcome, model=model).inc()
    RUN_DURATION.labels(scenario=scenario, model=model).observe(duration_seconds)
    QUALITY_SCORE.labels(scenario=scenario, model=model).observe(quality_score)
    POLICY_DECISIONS.labels(scenario=scenario, decision=policy_decision).inc()
    TOKENS.labels(scenario=scenario, model=model, direction="input").inc(input_tokens)
    TOKENS.labels(scenario=scenario, model=model, direction="output").inc(output_tokens)
    ESTIMATED_COST.labels(scenario=scenario, model=model).inc(estimated_cost_usd)
    TOOL_CALLS.labels(tool=tool, status=tool_status).inc()
    TOOL_DURATION.labels(tool=tool).observe(tool_duration_seconds)
    if retries:
        RETRIES.labels(tool=tool, reason="transient_error").inc(retries)
