export interface AIClientConfig {
  baseUrl: string;
  apiKey: string;
}

export interface AIRequest<T> {
  prompt: string;
  schemaHint: string;
  payload: T;
}

export async function runAIWorkflow<TInput, TOutput>(
  config: AIClientConfig,
  request: AIRequest<TInput>
): Promise<TOutput> {
  const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Return JSON only. ${request.schemaHint}`
        },
        {
          role: "user",
          content: `${request.prompt}\n\nPayload: ${JSON.stringify(request.payload)}`
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error("AI request failed");
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return JSON.parse(data.choices[0]?.message.content ?? "{}") as TOutput;
}
