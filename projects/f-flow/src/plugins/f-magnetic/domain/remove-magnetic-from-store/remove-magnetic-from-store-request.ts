export class RemoveMagneticFromStoreRequest {
  static readonly fToken = Symbol('RemoveMagneticFromStoreRequest');
  constructor(public readonly name: string) {}
}
