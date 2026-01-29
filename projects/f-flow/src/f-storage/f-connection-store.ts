import { FStoreElementBase } from './f-store-element-base';

export class FConnectionStore extends FStoreElementBase {
  private _instancesForCreate: unknown | undefined;
  private _instancesForSnap: unknown | undefined;

  public getForSnap<T>(): T | undefined {
    return this._instancesForSnap as T | undefined;
  }

  public getForCreate<T>(): T | undefined {
    return this._instancesForCreate as T | undefined;
  }

  public addForCreate<T>(instance: T): void {
    this._instancesForCreate = instance;
  }

  public addForSnap<T>(instance: T): void {
    this._instancesForSnap = instance;
  }

  public removeInstanceForCreate(): void {
    this._instancesForCreate = undefined;
  }

  public removeInstanceForSnap(): void {
    this._instancesForSnap = undefined;
  }
}
