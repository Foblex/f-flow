import { DestroyRef } from '@angular/core';
import { FNodeBase } from '../../../f-node';

export class UpdateNodeWhenStateOrSizeChangedRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('UpdateNodeWhenStateOrSizeChangedRequest');

  constructor(
    public readonly nodeOrGroup: FNodeBase,
    public readonly destroyRef: DestroyRef,
  ) {}
}
