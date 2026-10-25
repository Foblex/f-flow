export function flatMap<TInput, TResult>(
  payload: TInput[],
  callback: (item: TInput) => TResult[],
): TResult[] {
  return payload.flatMap(callback);
}
