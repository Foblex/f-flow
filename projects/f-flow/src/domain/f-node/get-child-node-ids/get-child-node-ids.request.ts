export class GetChildNodeIdsRequest {
  static readonly fToken = Symbol('GetChildNodeIdsRequest');
  constructor(
    public id?: string | null,
  ) {
  }
}
