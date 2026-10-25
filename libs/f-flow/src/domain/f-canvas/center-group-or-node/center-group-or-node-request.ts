export class CenterGroupOrNodeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('CenterGroupOrNodeRequest');
  constructor(
    public id: string,
    public animated: boolean,
    public emitCanvasChange: boolean = true,
    public resetScale: boolean = false,
  ) {}
}
