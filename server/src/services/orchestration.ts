export interface PipelineStep<TInput, TOutput> {
  name: string;
  run: (input: TInput) => Promise<TOutput>;
}

export async function runPipeline<TInput, TOutput>(
  input: TInput,
  steps: Array<PipelineStep<TInput, TOutput>>
): Promise<{ result: TOutput; trace: string[] }> {
  const trace: string[] = [];
  let current: TInput = input;
  let output: TOutput | undefined;

  for (const step of steps) {
    trace.push(step.name);
    output = await step.run(current);
    current = output as unknown as TInput;
  }

  return { result: output as TOutput, trace };
}
