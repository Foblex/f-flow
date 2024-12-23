import { DestroyRef } from '@angular/core';

export class ListenComponentsCountChangedRequest {

  constructor(
    public destroyRef: DestroyRef
  ) {
  }
}
