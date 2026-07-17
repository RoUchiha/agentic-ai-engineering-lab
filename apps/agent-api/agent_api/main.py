import os
from enum import StrEnum
from hashlib import sha256
from time import perf_counter
from typing import Literal

from fastapi import FastAPI, HTTPException
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
from pydantic import BaseModel, Field
from starlette.responses import Response

from agent_api.metrics import ACTIVE_RUNS, APPROVAL_QUEUE_DEPTH, record_run


class Risk(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RunRequest(BaseModel):
    case_id: str = Field(min_length=3, max_length=40)
    goal: str = Field(min_length=8, max_length=500)
    risk: Risk
    requested_action: Literal["read", "draft", "write"]
    scenario: Literal[
        "payment-investigation", "policy-evidence", "customer-remediation"
    ] = "payment-investigation"
    model: Literal["deterministic", "gpt-5.6-terra", "gpt-5.6-luna"] = "deterministic"
    simulate_failure: bool = False


class PolicyResult(BaseModel):
    allowed: bool
    approval_required: bool
    safe_default: str


class RunResponse(BaseModel):
    case_id: str
    status: Literal["completed", "approval_required"]
    plan: list[str]
    policy: PolicyResult


app = FastAPI(
    title="Agentic Systems API",
    version="1.0.0",
    description="Typed API boundary for a policy-gated agent workflow.",
)


def evaluate_policy(request: RunRequest) -> PolicyResult:
    if request.risk is Risk.HIGH and request.requested_action == "write":
        return PolicyResult(
            allowed=True,
            approval_required=True,
            safe_default="Keep source-system state unchanged until a reviewer approves.",
        )
    return PolicyResult(
        allowed=True,
        approval_required=False,
        safe_default="Return a read-only recommendation.",
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "agentic-systems-api"}


@app.get("/metrics", include_in_schema=False)
def metrics() -> Response:
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/v1/runs", response_model=RunResponse)
def create_run(request: RunRequest) -> RunResponse:
    started = perf_counter()
    ACTIVE_RUNS.labels(scenario=request.scenario).inc()
    try:
        policy = evaluate_policy(request)
        if not policy.allowed:
            raise HTTPException(status_code=403, detail="Action blocked by policy")

        digest = int(sha256(request.case_id.encode()).hexdigest()[:8], 16)
        tool = {
            "read": "search_policy",
            "draft": "draft_work_items",
            "write": "request_release",
        }[request.requested_action]
        input_tokens = 700 + digest % 900
        output_tokens = 160 + digest % 360
        quality_score = {
            "payment-investigation": 0.94,
            "policy-evidence": 0.97,
            "customer-remediation": 0.92,
        }[request.scenario]
        estimated_cost = (input_tokens * 0.0000015) + (output_tokens * 0.000006)
        retries = 1 if digest % 7 == 0 else 0
        demo_failures_enabled = os.getenv("OBSERVABILITY_DEMO_FAILURES") == "true"
        failed = request.simulate_failure and demo_failures_enabled
        outcome = "failed" if failed else (
            "approval_required" if policy.approval_required else "completed"
        )
        policy_decision = "approval_required" if policy.approval_required else "allow"
        measured_duration = perf_counter() - started
        logical_duration = measured_duration + 0.2 + (digest % 1800) / 1000
        tool_duration = 0.03 + (digest % 650) / 1000

        record_run(
            scenario=request.scenario,
            model=request.model,
            outcome=outcome,
            duration_seconds=logical_duration,
            quality_score=quality_score if not failed else 0.62,
            policy_decision=policy_decision,
            tool=tool,
            tool_status="error" if failed else "success",
            tool_duration_seconds=tool_duration,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            estimated_cost_usd=estimated_cost,
            retries=retries,
        )
        if policy.approval_required:
            APPROVAL_QUEUE_DEPTH.labels(queue="operations-maker-checker").set(2 + digest % 9)
        if failed:
            raise HTTPException(status_code=503, detail="Synthetic observability demo failure")

        return RunResponse(
            case_id=request.case_id,
            status="approval_required" if policy.approval_required else "completed",
            plan=[
                "Classify the request and select an allowlisted workflow",
                "Retrieve approved evidence and retain source identifiers",
                "Construct a recommendation and evaluate the action policy",
                "Execute only after any required approval",
            ],
            policy=policy,
        )
    finally:
        ACTIVE_RUNS.labels(scenario=request.scenario).dec()
