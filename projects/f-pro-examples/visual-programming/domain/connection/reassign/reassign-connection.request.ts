export class ReassignConnectionRequest {

  constructor(
    public readonly outputId: string,
    public readonly oldInputId: string,
    public readonly newInputId: string,
  ) {
  }
}
