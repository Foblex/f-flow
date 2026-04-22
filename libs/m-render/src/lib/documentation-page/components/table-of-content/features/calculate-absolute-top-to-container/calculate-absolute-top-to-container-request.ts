export class CalculateAbsoluteTopToContainerRequest {
  public static readonly requestToken = Symbol('CalculateAbsoluteTopToContainerRequest');

  constructor(
    public element: HTMLElement,
  ) {
  }
}
