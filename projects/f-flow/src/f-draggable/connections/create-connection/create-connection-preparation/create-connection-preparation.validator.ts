import { Injectable } from '@angular/core';
import { CreateConnectionPreparationRequest } from './create-connection-preparation.request';
import { FValidatorRegister, IValidator } from '../../../../infrastructure';
import { FNodeBase } from '../../../../f-node';
import { FComponentsStore } from '../../../../f-storage';
import { IPointerEvent } from '@foblex/core';
import { FDraggableDataContext } from '../../../f-draggable-data-context';

@Injectable()
@FValidatorRegister(CreateConnectionPreparationRequest)
export class CreateConnectionPreparationValidator implements IValidator<CreateConnectionPreparationRequest> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: CreateConnectionPreparationRequest): boolean {
    return !!this.getNode(request.event) && this.isValidConditions();
  }

  private getNode(event: IPointerEvent): FNodeBase | undefined {
    return this.fComponentsStore.findNode(event.targetElement);
  }

  private isValidConditions(): boolean {
    return !this.fDraggableDataContext.draggableItems.length && !!this.fComponentsStore.fTempConnection;
  }
}
