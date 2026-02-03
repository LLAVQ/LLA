export type PipelineStep<TInput, TOutput> = {
  name: string;
  run: (input: TInput) => Promise<TOutput>;
};

export async function runPipeline<TInput, TOutput>(
  input: TInput,
  steps: Array<PipelineStep<TInput, TOutput>>,
  onStep?: (stepName: string) => void
): Promise<TOutput> {
  let current: TInput = input;
  let result: TOutput | undefined;

  for (const step of steps) {
    onStep?.(step.name);
    result = await step.run(current);
    current = result as unknown as TInput;
  }

  return result as TOutput;
}
