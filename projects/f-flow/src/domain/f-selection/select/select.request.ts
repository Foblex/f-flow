export class SelectRequest {
  static readonly fToken = Symbol('SelectRequest');
  constructor(
    public nodes: string[],
    public connections: string[],
    public isSelectedChanged: boolean = true,
  ) {
  }
}
