import { DestroyRef } from '@angular/core';

export class ListenComponentsDataChangedRequest {

  constructor(
    public destroyRef: DestroyRef
  ) {
  }
}
