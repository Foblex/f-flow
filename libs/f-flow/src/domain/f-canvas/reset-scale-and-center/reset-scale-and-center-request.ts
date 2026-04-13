export class ResetScaleAndCenterRequest {
  static readonly fToken = Symbol('ResetScaleAndCenterRequest');
  constructor(public readonly animated: boolean) {}
}
