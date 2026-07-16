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
