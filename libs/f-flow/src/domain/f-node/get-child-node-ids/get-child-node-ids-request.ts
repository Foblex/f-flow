export class GetChildNodeIdsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: string[];

  static readonly fToken = Symbol('GetChildNodeIdsRequest');
  constructor(public id?: string | null) {}
}
