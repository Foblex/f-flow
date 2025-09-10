export class ResetScaleAndCenterRequest {
  static readonly fToken = Symbol('ResetScaleAndCenterRequest');
  constructor(
    public animated: boolean,
  ) {
  }
}
