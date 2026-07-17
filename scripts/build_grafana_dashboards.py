"""Build deterministic Grafana dashboards from readable Python definitions."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "observability" / "grafana" / "dashboards"
DATASOURCE = {"type": "prometheus", "uid": "prometheus-agentic"}


def target(expression: str, legend: str = "", ref_id: str = "A") -> dict[str, Any]:
    return {
        "datasource": DATASOURCE,
        "editorMode": "code",
        "expr": expression,
        "legendFormat": legend,
        "range": True,
        "refId": ref_id,
    }


def panel(
    panel_id: int,
    title: str,
    expression: str,
    *,
    panel_type: str = "timeseries",
    unit: str = "short",
    legend: str = "",
    x: int = 0,
    y: int = 0,
    w: int = 12,
    h: int = 8,
) -> dict[str, Any]:
    return {
        "id": panel_id,
        "title": title,
        "type": panel_type,
        "datasource": DATASOURCE,
        "gridPos": {"x": x, "y": y, "w": w, "h": h},
        "fieldConfig": {
            "defaults": {
                "unit": unit,
                "color": {"mode": "palette-classic"},
                "thresholds": {
                    "mode": "absolute",
                    "steps": [
                        {"color": "green", "value": None},
                        {"color": "orange", "value": 0.95 if unit == "percentunit" else 1.5},
                    ],
                },
            },
            "overrides": [],
        },
        "options": {
            "legend": {"displayMode": "list", "placement": "bottom"},
            "tooltip": {"mode": "multi", "sort": "desc"},
            "reduceOptions": {"calcs": ["lastNotNull"], "fields": "", "values": False},
            "orientation": "auto",
            "textMode": "auto",
            "colorMode": "value",
            "graphMode": "area",
            "justifyMode": "auto",
        },
        "targets": [target(expression, legend)],
    }


def dashboard(uid: str, title: str, description: str, panels: list[dict[str, Any]], *, variables: bool = True) -> dict[str, Any]:
    templating = []
    if variables:
        templating = [
            {
                "name": "scenario",
                "label": "Scenario",
                "type": "query",
                "datasource": DATASOURCE,
                "query": {"query": "label_values(agent_runs_total, scenario)", "refId": "scenario"},
                "includeAll": True,
                "allValue": ".*",
                "current": {"text": "All", "value": "$__all"},
                "refresh": 1,
            },
            {
                "name": "model",
                "label": "Model",
                "type": "query",
                "datasource": DATASOURCE,
                "query": {"query": "label_values(agent_runs_total, model)", "refId": "model"},
                "includeAll": True,
                "allValue": ".*",
                "current": {"text": "All", "value": "$__all"},
                "refresh": 1,
            },
        ]
    return {
        "annotations": {"list": []},
        "description": description,
        "editable": False,
        "fiscalYearStartMonth": 0,
        "graphTooltip": 1,
        "id": None,
        "links": [],
        "panels": panels,
        "refresh": "10s",
        "schemaVersion": 41,
        "tags": ["agentic-ai", "portfolio", "prometheus"],
        "templating": {"list": templating},
        "time": {"from": "now-30m", "to": "now"},
        "timepicker": {},
        "timezone": "browser",
        "title": title,
        "uid": uid,
        "version": 1,
        "weekStart": "",
    }


FILTER = 'scenario=~"$scenario", model=~"$model"'

DASHBOARDS = {
    "agent-slo-command-center.json": dashboard(
        "agent-slo-command-center",
        "01 - Agent SLO Command Center",
        "Availability, latency, approvals, throughput, and error-budget health for agent workflows.",
        [
            panel(1, "Success rate", f'sum(rate(agent_runs_total{{{FILTER}, outcome=~"completed|approval_required"}}[$__rate_interval])) / clamp_min(sum(rate(agent_runs_total{{{FILTER}}}[$__rate_interval])), 0.001)', panel_type="stat", unit="percentunit", x=0, y=0, w=6, h=5),
            panel(2, "p95 run latency", f'histogram_quantile(0.95, sum by (le) (rate(agent_run_duration_seconds_bucket{{{FILTER}}}[$__rate_interval])))', panel_type="stat", unit="s", x=6, y=0, w=6, h=5),
            panel(3, "Error-budget burn (99% SLO)", f'(1 - (sum(rate(agent_runs_total{{{FILTER}, outcome=~"completed|approval_required"}}[$__rate_interval])) / clamp_min(sum(rate(agent_runs_total{{{FILTER}}}[$__rate_interval])), 0.001))) / 0.01', panel_type="stat", unit="short", x=12, y=0, w=6, h=5),
            panel(4, "Run throughput", f'sum(rate(agent_runs_total{{{FILTER}}}[$__rate_interval]))', panel_type="stat", unit="ops", x=18, y=0, w=6, h=5),
            panel(5, "p95 latency by scenario", f'histogram_quantile(0.95, sum by (le, scenario) (rate(agent_run_duration_seconds_bucket{{{FILTER}}}[$__rate_interval])))', unit="s", legend="{{scenario}}", x=0, y=5, w=12, h=8),
            panel(6, "Outcomes by scenario", f'sum by (scenario, outcome) (rate(agent_runs_total{{{FILTER}}}[$__rate_interval]))', unit="ops", legend="{{scenario}} · {{outcome}}", x=12, y=5, w=12, h=8),
            panel(7, "Approval queue depth", "max by (queue) (agent_approval_queue_depth)", legend="{{queue}}", x=0, y=13, w=8, h=7),
            panel(8, "Active runs", 'sum by (scenario) (agent_active_runs{scenario=~"$scenario"})', legend="{{scenario}}", x=8, y=13, w=8, h=7),
            panel(9, "Policy decisions", 'sum by (scenario, decision) (rate(agent_policy_decisions_total{scenario=~"$scenario"}[$__rate_interval]))', unit="ops", legend="{{scenario}} · {{decision}}", x=16, y=13, w=8, h=7),
        ],
    ),
    "cost-quality-correlator.json": dashboard(
        "cost-quality-correlator",
        "02 - Cost-Quality Correlator",
        "Cost, tokens, and evaluation quality viewed together so model routing decisions are measurable.",
        [
            panel(1, "Estimated spend in range", f'sum(increase(llm_estimated_cost_usd_total{{{FILTER}}}[$__range]))', panel_type="stat", unit="currencyUSD", x=0, y=0, w=6, h=5),
            panel(2, "Cost per run", f'sum(rate(llm_estimated_cost_usd_total{{{FILTER}}}[$__rate_interval])) / clamp_min(sum(rate(agent_runs_total{{{FILTER}}}[$__rate_interval])), 0.001)', panel_type="stat", unit="currencyUSD", x=6, y=0, w=6, h=5),
            panel(3, "Mean quality score", f'sum(rate(agent_quality_score_sum{{{FILTER}}}[$__rate_interval])) / clamp_min(sum(rate(agent_quality_score_count{{{FILTER}}}[$__rate_interval])), 0.001)', panel_type="stat", unit="percentunit", x=12, y=0, w=6, h=5),
            panel(4, "Token throughput", f'sum(rate(llm_tokens_total{{{FILTER}}}[$__rate_interval]))', panel_type="stat", unit="ops", x=18, y=0, w=6, h=5),
            panel(5, "Estimated cost rate by model", f'sum by (model) (rate(llm_estimated_cost_usd_total{{{FILTER}}}[$__rate_interval]))', unit="currencyUSD", legend="{{model}}", x=0, y=5, w=12, h=8),
            panel(6, "Mean quality by model", f'sum by (model) (rate(agent_quality_score_sum{{{FILTER}}}[$__rate_interval])) / clamp_min(sum by (model) (rate(agent_quality_score_count{{{FILTER}}}[$__rate_interval])), 0.001)', unit="percentunit", legend="{{model}}", x=12, y=5, w=12, h=8),
            panel(7, "Tokens by direction", f'sum by (model, direction) (rate(llm_tokens_total{{{FILTER}}}[$__rate_interval]))', unit="ops", legend="{{model}} · {{direction}}", x=0, y=13, w=12, h=8),
            panel(8, "Quality per dollar", f'(sum by (model) (rate(agent_quality_score_sum{{{FILTER}}}[$__rate_interval])) / clamp_min(sum by (model) (rate(agent_quality_score_count{{{FILTER}}}[$__rate_interval])), 0.001)) / clamp_min(sum by (model) (rate(llm_estimated_cost_usd_total{{{FILTER}}}[$__rate_interval])) / clamp_min(sum by (model) (rate(agent_runs_total{{{FILTER}}}[$__rate_interval])), 0.001), 0.000001)', legend="{{model}}", x=12, y=13, w=12, h=8),
        ],
    ),
    "tool-reliability-lab.json": dashboard(
        "tool-reliability-lab",
        "03 - Tool Reliability Lab",
        "Tool success, latency, retries, and failure concentration for diagnosing agent dependency health.",
        [
            panel(1, "Tool success rate", 'sum(rate(agent_tool_calls_total{status="success"}[$__rate_interval])) / clamp_min(sum(rate(agent_tool_calls_total[$__rate_interval])), 0.001)', panel_type="stat", unit="percentunit", x=0, y=0, w=6, h=5),
            panel(2, "Tool p95 latency", "histogram_quantile(0.95, sum by (le) (rate(agent_tool_duration_seconds_bucket[$__rate_interval])))", panel_type="stat", unit="s", x=6, y=0, w=6, h=5),
            panel(3, "Retry rate", "sum(rate(agent_retries_total[$__rate_interval]))", panel_type="stat", unit="ops", x=12, y=0, w=6, h=5),
            panel(4, "Tool call throughput", "sum(rate(agent_tool_calls_total[$__rate_interval]))", panel_type="stat", unit="ops", x=18, y=0, w=6, h=5),
            panel(5, "Calls by tool and status", "sum by (tool, status) (rate(agent_tool_calls_total[$__rate_interval]))", unit="ops", legend="{{tool}} · {{status}}", x=0, y=5, w=12, h=8),
            panel(6, "p95 latency by tool", "histogram_quantile(0.95, sum by (le, tool) (rate(agent_tool_duration_seconds_bucket[$__rate_interval])))", unit="s", legend="{{tool}}", x=12, y=5, w=12, h=8),
            panel(7, "Retries by tool", "sum by (tool, reason) (rate(agent_retries_total[$__rate_interval]))", unit="ops", legend="{{tool}} · {{reason}}", x=0, y=13, w=12, h=8),
            panel(8, "Failure share by tool", 'sum by (tool) (rate(agent_tool_calls_total{status="error"}[$__rate_interval])) / clamp_min(sum(rate(agent_tool_calls_total{status="error"}[$__rate_interval])), 0.001)', unit="percentunit", legend="{{tool}}", x=12, y=13, w=12, h=8),
        ],
        variables=False,
    ),
}


def render(document: dict[str, Any]) -> str:
    return json.dumps(document, indent=2, sort_keys=True) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Fail if generated files are stale.")
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    stale: list[str] = []
    for filename, document in DASHBOARDS.items():
        path = OUTPUT / filename
        expected = render(document)
        if args.check:
            if not path.exists() or path.read_text(encoding="utf-8") != expected:
                stale.append(filename)
        else:
            path.write_text(expected, encoding="utf-8")
    if stale:
        print("Stale Grafana dashboards: " + ", ".join(stale))
        return 1
    print(f"Validated {len(DASHBOARDS)} Grafana dashboards." if args.check else f"Built {len(DASHBOARDS)} Grafana dashboards.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
