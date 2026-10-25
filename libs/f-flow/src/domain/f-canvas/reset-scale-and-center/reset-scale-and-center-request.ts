export class ResetScaleAndCenterRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('ResetScaleAndCenterRequest');
  constructor(
    public readonly animated: boolean,
    public readonly emitCanvasChange: boolean = true,
  ) {}
}
