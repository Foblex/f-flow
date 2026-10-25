import { DestroyRef } from '@angular/core';

export class QueueConnectionRedrawRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('QueueConnectionRedrawRequest');

  constructor(public readonly destroyRef: DestroyRef) {}
}
