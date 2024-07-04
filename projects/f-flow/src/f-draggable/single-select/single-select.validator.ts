import { Injectable } from '@angular/core';
import { FValidatorRegister, IValidator } from '../../infrastructure';
import { SingleSelectRequest } from './single-select.request';
import { FComponentsStore } from '../../f-storage';

@Injectable()
@FValidatorRegister(SingleSelectRequest)
export class SingleSelectValidator implements IValidator<SingleSelectRequest> {

  constructor(
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: SingleSelectRequest): boolean {
    return this.fComponentsStore.fFlow!.hostElement.contains(request.event.targetElement);
  }
}
