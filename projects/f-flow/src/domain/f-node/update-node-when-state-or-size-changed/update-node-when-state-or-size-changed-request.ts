import { DestroyRef } from '@angular/core';
import { FNodeBase } from '../../../f-node';

export class UpdateNodeWhenStateOrSizeChangedRequest {
  static readonly fToken = Symbol('UpdateNodeWhenStateOrSizeChangedRequest');
  constructor(
    public fComponent: FNodeBase,
    public destroyRef: DestroyRef,
  ) {
  }
}
