import { Injectable } from '@angular/core';
import { GetInputUnderPointerRequest } from './get-input-under-pointer.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { OutputNotFound } from '../../../errors';
import { FComponentsStore } from '../../../f-storage';
import { FConnectorBase } from '../../../f-connectors';
import { CreateConnectionDragHandler } from '../create-connection';
import { ReassignConnectionDragHandler } from '../reassign-connection';

@Injectable()
@FValidatorRegister(GetInputUnderPointerRequest)
export class GetInputUnderPointerValidator implements IValidator<GetInputUnderPointerRequest> {

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetInputUnderPointerRequest): boolean {
    let output = this.getOutput(request.dragHandler) || this.getOutlet(request.dragHandler);
    if (!output) {
      throw OutputNotFound(request.dragHandler.connection.fOutputId);
    }
    return true;
  }

  private getOutput(dragHandler: CreateConnectionDragHandler | ReassignConnectionDragHandler): FConnectorBase | undefined {
    return this.fComponentsStore.fOutputs.find((x) => x.id === dragHandler.connection.fOutputId);
  }

  private getOutlet(dragHandler: CreateConnectionDragHandler | ReassignConnectionDragHandler): FConnectorBase | undefined {
    return this.fComponentsStore.fOutlets.find((x) => x.id === dragHandler.connection.fOutputId);
  }
}
