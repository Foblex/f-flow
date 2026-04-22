export class ActivateTocByHashRequest {
  public static readonly requestToken = Symbol('ActivateTocByHashRequest');

  constructor(
    public hash: string | undefined,
  ) {
  }
}
