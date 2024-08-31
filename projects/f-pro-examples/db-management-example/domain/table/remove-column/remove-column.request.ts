export class RemoveColumnRequest {

  constructor(
    public readonly tableId: string,
    public readonly columnId: string,
  ) {
  }
}
