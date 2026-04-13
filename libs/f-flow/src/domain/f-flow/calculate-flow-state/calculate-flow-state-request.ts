export class CalculateFlowStateRequest {
  static readonly fToken = Symbol('CalculateFlowStateRequest');

  constructor(public readonly measuredSize: boolean = false) {}
}
