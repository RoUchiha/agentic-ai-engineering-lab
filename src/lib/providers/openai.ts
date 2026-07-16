interface OpenAIResponse {
  output_text?: string;
}

export async function generateLiveSummary(input: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6-terra",
      instructions: "Summarize the supplied agent trace. Do not add facts. Preserve approval requirements and evidence identifiers.",
      input,
      store: false,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI request failed with status ${response.status}`);
  const payload = (await response.json()) as OpenAIResponse;
  if (!payload.output_text) throw new Error("OpenAI response did not contain output_text");
  return payload.output_text;
}
