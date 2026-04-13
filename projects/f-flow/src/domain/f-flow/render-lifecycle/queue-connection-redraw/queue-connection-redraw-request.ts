import { DestroyRef } from '@angular/core';

export class QueueConnectionRedrawRequest {
  static readonly fToken = Symbol('QueueConnectionRedrawRequest');

  constructor(public readonly destroyRef: DestroyRef) {}
}
