import { IHandler, IPoint, IRect, Point } from '@foblex/core';
import { Injectable } from '@angular/core';
import { CreateConnectionFromOutputPreparationRequest } from './create-connection-from-output-preparation.request';
import { FConnectorBase } from '../../../../../f-connectors';
import { CreateConnectionDragHandlerRequest } from '../create-connection-drag-handler';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FFlowMediator } from '../../../../../infrastructure';
import { GetElementRectInFlowRequest } from '../../../../../domain';

@Injectable()
@FExecutionRegister(CreateConnectionFromOutputPreparationRequest)
export class CreateConnectionFromOutputPreparationExecution
  implements IHandler<CreateConnectionFromOutputPreparationRequest, void> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FFlowMediator,
  ) {
  }

  public handle(request: CreateConnectionFromOutputPreparationRequest): void {
    const { event } = request;
    const pointerPositionInFlow = Point.fromPoint(event.getPosition()).elementTransform(this.flowHost);

    const output = this.fComponentsStore.fOutputs.find((x) => {
      return x.hostElement.contains(event.targetElement);
    });
    if (!output) {
      throw new Error('Output not found');
    }
    if (output.canBeConnected) {
      const outputCenter = this.fMediator.send<IRect>(new GetElementRectInFlowRequest(output.hostElement)).gravityCenter;
      this.createDragHandler(pointerPositionInFlow, output, outputCenter);
    }
  }

  private createDragHandler(position: IPoint, output: FConnectorBase, outletCenter: IPoint): void {
    this.fMediator.send(new CreateConnectionDragHandlerRequest(position, output, outletCenter));
  }
}
