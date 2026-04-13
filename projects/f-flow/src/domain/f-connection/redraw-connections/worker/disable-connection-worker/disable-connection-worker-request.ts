export class DisableConnectionWorkerRequest {
  static readonly fToken = Symbol('DisableConnectionWorkerRequest');

  constructor(public error: Error) {}
}
