export class SelectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('SelectRequest');
  constructor(
    public nodes: string[],
    public connections: string[],
    public isSelectedChanged: boolean = true,
  ) {}
}
