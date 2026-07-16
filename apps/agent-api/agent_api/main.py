from enum import StrEnum
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


class Risk(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RunRequest(BaseModel):
    case_id: str = Field(min_length=3, max_length=40)
    goal: str = Field(min_length=8, max_length=500)
    risk: Risk
    requested_action: Literal["read", "draft", "write"]


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


@app.post("/v1/runs", response_model=RunResponse)
def create_run(request: RunRequest) -> RunResponse:
    policy = evaluate_policy(request)
    if not policy.allowed:
        raise HTTPException(status_code=403, detail="Action blocked by policy")
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
