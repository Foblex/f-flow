import { DestroyRef } from '@angular/core';

export class ListenComponentsDataChangesRequest {

  constructor(
    public destroyRef: DestroyRef
  ) {
  }
}
