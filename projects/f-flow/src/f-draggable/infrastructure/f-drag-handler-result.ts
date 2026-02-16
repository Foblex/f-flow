import { Injectable } from '@angular/core';

@Injectable()
export class FDragHandlerResult<T> {
  private _data: T | undefined;

  public setData(data: Partial<T>): void {
    this._data = { ...this._data, ...data } as T;
  }

  public getData(): T {
    return this._data!;
  }

  public clear(): void {
    this._data = undefined;
  }
}
