export class ScrollToElementInContainerRequest {
  public static readonly requestToken = Symbol('ScrollToElementInContainerRequest');

  constructor(public hash: string) {
  }
}
