# Five-minute interview walkthrough

## Opening (30 seconds)

“This portfolio answers a specific question: how do you let an AI system take useful steps without giving it unsafe authority? I built one connected lab with three enterprise workflows, explicit tool permissions, human approval, evaluations, and a complete trace.”

## Demo (two minutes)

1. Open Mission Control and choose **Payment exception triage**.
2. Point out the five roles before running it: orchestrator, retriever, specialist, risk reviewer, human approval.
3. Run the workflow.
4. Show that the recommendation is complete but the outcome is `approval_required`.
5. Explain the safe default: the payment remains unchanged.
6. Show evidence IDs, policy event, evaluation score, stable trace ID, latency, tools, retries, and cost.
7. Switch to **Policy evidence assistant** and explain that it completes automatically because it is a read-only answer grounded in approved documents.

## Architecture explanation (one minute)

“The scenario registry is the source of truth for risk, evidence, tools, and expected behavior. The runtime coordinates logical agent roles. The policy module is separate from the model and blocks unknown tools. The evaluator is also independent, so the system cannot grade itself by simply saying it did well.”

## Production path (one minute)

“The demo is deterministic so any reviewer can run it for free. In production I would persist run and approval state, put long tasks on a durable queue, enforce user-level authorization at each tool, replace fixtures with access-controlled hybrid retrieval, and export OpenTelemetry traces. Live model generation is an adapter, not a dependency of the control plane.”

## Close (30 seconds)

“The key design choice is bounded autonomy: the agent does the expensive reading and coordination work, while policy and people retain authority over high-impact actions.”

## Likely questions

### Why multiple agents instead of one prompt?

They are logical responsibilities, not a claim that every role needs a separate LLM call. Separation improves prompts, permissions, evaluation, and ownership. A low-cost deployment can run several roles deterministically or with one model.

### How would you prevent prompt injection?

Treat retrieved content as untrusted data, keep tool authorization outside the prompt, label source trust, deny unknown tools, sanitize tool arguments, and test adversarial documents. Do not let a retrieved instruction change system policy.

### How do you know the agent is good?

Use task-specific golden cases, claim/evidence checks, policy tests, operational thresholds, and human review. Keep individual metrics visible instead of hiding failures inside one average score.

### What happens when a provider is down?

Persist the run state, retry only idempotent steps with backoff, use a model fallback only when quality and data rules allow it, and surface a recoverable failure. Never repeat a write without an idempotency key.

### How would you measure value?

Compare assisted and baseline workflows on cycle time, analyst touches, error rate, policy exceptions, override rate, customer SLA attainment, and cost per completed case. Do not use token volume as a business success metric.
