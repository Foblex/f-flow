export class DisableConnectionWorkerRequest {
  static readonly fToken = Symbol('DisableConnectionWorkerRequest');

  constructor(public readonly error: Error) {}
}
