export function flatMap<TInput, TResult>(
  payload: TInput[],
  callback: (item: TInput) => TResult[],
): TResult[] {
  return payload.reduce((result: TResult[], x: TInput) => [...result, ...callback(x)], []);
}
