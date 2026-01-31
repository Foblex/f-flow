import { FIdRegistry } from './f-id-registry';
import { FConnectionForCreateComponent, FSnapConnectionComponent } from '../f-connection';
import { FConnectionBase } from '../f-connection-v2';

export class FConnectionRegistry extends FIdRegistry<FConnectionBase> {
  protected readonly kind = 'Connection';

  private _instancesForCreate: FConnectionForCreateComponent | undefined;
  private _instancesForSnap: FSnapConnectionComponent | undefined;

  public getForSnap(): FSnapConnectionComponent | undefined {
    return this._instancesForSnap;
  }

  public getForCreate(): FConnectionForCreateComponent | undefined {
    return this._instancesForCreate;
  }

  public addForCreate(instance: FConnectionForCreateComponent): void {
    this._instancesForCreate = instance;
  }

  public addForSnap(instance: FSnapConnectionComponent): void {
    this._instancesForSnap = instance;
  }

  public removeInstanceForCreate(): void {
    this._instancesForCreate = undefined;
  }

  public removeInstanceForSnap(): void {
    this._instancesForSnap = undefined;
  }
}
