/**
 * A request class may declare the type its execution returns as an erased phantom field:
 *
 * ```ts
 * export class GetNormalizedPointRequest {
 *   declare readonly __response: IPoint; // `declare` - never exists at runtime
 *   constructor(public readonly position: IPoint) {}
 * }
 * ```
 *
 * `FMediator.execute` then infers the response type from the request, and
 * `FExecutionRegister` verifies at compile time that the registered execution actually
 * returns it. Requests without the phantom keep the legacy explicit-generic behavior.
 */
export interface IRequestWithResponse<TResponse = unknown> {
  readonly __response: TResponse;
}

/** Response type of a request: the phantom when declared, `unknown` otherwise. */
export type FResponseOf<TRequest> = TRequest extends { __response: infer TResponse }
  ? TResponse
  : unknown;
