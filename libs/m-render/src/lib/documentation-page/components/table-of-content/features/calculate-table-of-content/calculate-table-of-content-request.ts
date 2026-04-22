export class CalculateTableOfContentRequest {
  public static readonly requestToken = Symbol('CalculateTableOfContentRequest');

  constructor(
    public readonly hostElement: HTMLElement,
  ) {
  }
}
