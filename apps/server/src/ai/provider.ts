export type AIProviderConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export type AIChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIClient = {
  generate: (messages: AIChatMessage[]) => Promise<string>;
};

export const createOpenAICompatibleClient = (config: AIProviderConfig): AIClient => {
  return {
    async generate(messages) {
      const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`AI provider error: ${response.status}`);
      }

      const data = (await response.json()) as {
        choices?: { message: { content: string } }[];
      };

      return data.choices?.[0]?.message?.content ?? "";
    }
  };
};
