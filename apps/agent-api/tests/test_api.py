from fastapi.testclient import TestClient

from agent_api.main import app


client = TestClient(app)


def test_high_risk_write_requires_approval() -> None:
    response = client.post(
        "/v1/runs",
        json={
            "case_id": "PAY-2847",
            "goal": "Prepare a safe release recommendation",
            "risk": "high",
            "requested_action": "write",
        },
    )
    assert response.status_code == 200
    assert response.json()["status"] == "approval_required"


def test_invalid_request_is_rejected_at_the_boundary() -> None:
    response = client.post(
        "/v1/runs",
        json={"case_id": "x", "goal": "short", "risk": "unknown", "requested_action": "delete"},
    )
    assert response.status_code == 422


def test_prometheus_metrics_expose_agent_contract() -> None:
    client.post(
        "/v1/runs",
        json={
            "case_id": "POL-1841",
            "goal": "Answer a policy question with supporting evidence",
            "risk": "medium",
            "requested_action": "read",
            "scenario": "policy-evidence",
            "model": "gpt-5.6-luna",
        },
    )
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "agent_runs_total" in response.text
    assert "agent_run_duration_seconds_bucket" in response.text
    assert "llm_estimated_cost_usd_total" in response.text
    assert "agent_tool_calls_total" in response.text
