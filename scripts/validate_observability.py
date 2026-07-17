"""Validate the portable observability stack without requiring Docker."""

from __future__ import annotations

import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
DASHBOARD_DIR = ROOT / "observability" / "grafana" / "dashboards"
EXPECTED_UIDS = {
    "agent-slo-command-center",
    "cost-quality-correlator",
    "tool-reliability-lab",
}
EXPECTED_METRICS = {
    "agent_runs_total",
    "agent_run_duration_seconds_bucket",
    "agent_quality_score_sum",
    "agent_tool_calls_total",
    "agent_tool_duration_seconds_bucket",
    "agent_retries_total",
    "llm_tokens_total",
    "llm_estimated_cost_usd_total",
}


def main() -> int:
    paths = sorted(DASHBOARD_DIR.glob("*.json"))
    assert len(paths) == 3, f"expected 3 dashboards, found {len(paths)}"
    dashboards = [json.loads(path.read_text(encoding="utf-8")) for path in paths]
    assert {item["uid"] for item in dashboards} == EXPECTED_UIDS
    assert all(item["schemaVersion"] >= 41 for item in dashboards)
    assert all(len(item["panels"]) >= 8 for item in dashboards)

    expressions = "\n".join(
        target["expr"]
        for item in dashboards
        for panel in item["panels"]
        for target in panel["targets"]
    )
    missing = sorted(metric for metric in EXPECTED_METRICS if metric not in expressions)
    assert not missing, f"dashboard queries missing metrics: {missing}"

    yaml_paths = [
        ROOT / "observability/docker-compose.yml",
        ROOT / "observability/prometheus/prometheus.yml",
        ROOT / "observability/grafana/provisioning/datasources/prometheus.yml",
        ROOT / "observability/grafana/provisioning/dashboards/dashboards.yml",
        ROOT / "observability/grafana/provisioning/alerting/alert-rules.yml",
    ]
    parsed = {path: yaml.safe_load(path.read_text(encoding="utf-8")) for path in yaml_paths}
    assert all(isinstance(document, dict) for document in parsed.values())
    datasource = yaml_paths[2].read_text(encoding="utf-8")
    alerts = yaml_paths[4].read_text(encoding="utf-8")
    prometheus = yaml_paths[1].read_text(encoding="utf-8")
    compose = yaml_paths[0].read_text(encoding="utf-8")
    assert "uid: prometheus-agentic" in datasource
    assert alerts.count("condition: threshold") == 3
    assert "agent-api:8000" in prometheus
    assert "grafana/grafana:" in compose and "prom/prometheus:" in compose
    print("Observability validation passed: 3 dashboards, 3 alerts, 1 Prometheus scrape target.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
