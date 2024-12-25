import { DestroyRef } from '@angular/core';

export class ListenComponentsCountChangesRequest {

  constructor(
    public destroyRef: DestroyRef
  ) {
  }
}
