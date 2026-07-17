"""Generate safe, synthetic traffic so the dashboards have data immediately."""

import json
import os
import time
from itertools import count
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

API_URL = os.getenv("AGENT_API_URL", "http://localhost:8000")
SCENARIOS = (
    ("payment-investigation", "high", "write"),
    ("policy-evidence", "low", "read"),
    ("customer-remediation", "medium", "draft"),
)
MODELS = ("deterministic", "gpt-5.6-terra", "gpt-5.6-luna")


def post_run(sequence: int) -> None:
    scenario, risk, action = SCENARIOS[sequence % len(SCENARIOS)]
    body = json.dumps(
        {
            "case_id": f"DEMO-{sequence:06d}",
            "goal": "Generate synthetic observability telemetry for the local portfolio.",
            "risk": risk,
            "requested_action": action,
            "scenario": scenario,
            "model": MODELS[(sequence // len(SCENARIOS)) % len(MODELS)],
            "simulate_failure": sequence % 11 == 0,
        }
    ).encode()
    request = Request(
        f"{API_URL}/v1/runs",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=5):
            pass
    except HTTPError as error:
        if error.code != 503:
            print(f"unexpected HTTP status: {error.code}", flush=True)
    except URLError as error:
        print(f"waiting for agent API: {error.reason}", flush=True)


if __name__ == "__main__":
    for index in count(1):
        post_run(index)
        time.sleep(1)
