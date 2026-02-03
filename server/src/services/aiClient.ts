import "dotenv/config";

export interface AIClientConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export async function requestAI<TInput, TOutput>(
  config: AIClientConfig,
  payload: TInput,
  schemaHint: string
): Promise<TOutput> {
  const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content: `Return JSON only. ${schemaHint}`
        },
        {
          role: "user",
          content: JSON.stringify(payload)
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return JSON.parse(data.choices[0]?.message.content ?? "{}") as TOutput;
}

export function getAIConfig(): AIClientConfig {
  return {
    baseUrl: process.env.AI_BASE_URL ?? "https://api.openai.com",
    apiKey: process.env.AI_API_KEY ?? "",
    model: process.env.AI_MODEL ?? "gpt-4o-mini"
  };
}
