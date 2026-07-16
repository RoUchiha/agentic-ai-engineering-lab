# Access requirements

## Required for the local demo

Nothing beyond Node.js 20.9+ and npm. The deterministic workflows are deliberately free and offline after dependency installation.

## Optional services

| Service | Why use it | Sign-up/access needed | Environment variable |
|---|---|---|---|
| OpenAI API | Replace the deterministic summarizer with live model generation | OpenAI Platform account, billing, API key | `OPENAI_API_KEY`, optional `OPENAI_MODEL` |
| LangSmith | Hosted LLM traces, datasets, and evaluations | LangSmith account and project | `LANGSMITH_API_KEY` |
| OpenTelemetry backend | Vendor-neutral traces and metrics | Access to Grafana, Datadog, Honeycomb, or another OTLP collector | `OTEL_EXPORTER_OTLP_ENDPOINT` |
| Pinecone | Managed vector search for larger document collections | Pinecone account and index | `PINECONE_API_KEY` |
| Vercel | Public deployment of the Next.js application | Vercel account connected to GitHub | Configured in Vercel, not committed |
| GitHub | Source hosting and Actions CI | GitHub account with repository access | No token committed to the repository |

## Recommended first deployment

Use only GitHub and Vercel. Keep the deterministic provider enabled so the public demo is stable and costs nothing per click. Add a live model mode later behind authentication, a rate limit, spend alerts, and a visible “live provider” label.

## Secret handling

- Copy `.env.example` to `.env.local` for local-only values.
- Never commit `.env.local` or paste keys into source files.
- Use the hosting provider's encrypted environment variable store.
- Rotate a key immediately if it appears in a terminal transcript, issue, screenshot, or commit.
- Give production integrations the narrowest available permission and separate development from production credentials.

## Current optional OpenAI adapter

`src/lib/providers/openai.ts` uses the Responses API for an evidence-preserving summary. The default application does not call it. This is intentional: provider access is an enhancement, not a prerequisite for reviewing the architecture.

Official references: [Responses API](https://developers.openai.com/api/reference/resources/responses), [models](https://developers.openai.com/api/docs/models), and [function calling](https://developers.openai.com/api/docs/guides/function-calling).
