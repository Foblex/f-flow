import { DestroyRef } from '@angular/core';

export class UpdateLayersWhenComponentsChangedRequest {

  constructor(
    public destroyRef: DestroyRef
  ) {
  }
}
