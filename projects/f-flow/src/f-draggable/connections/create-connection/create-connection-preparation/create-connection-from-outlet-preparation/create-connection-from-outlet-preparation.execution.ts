import { IHandler, IPoint, IRect, Point } from '@foblex/core';
import { Injectable } from '@angular/core';
import { CreateConnectionFromOutletPreparationRequest } from './create-connection-from-outlet-preparation.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FFlowMediator } from '../../../../../infrastructure';
import { FConnectorBase, FNodeOutletBase, FNodeOutputBase } from '../../../../../f-connectors';
import { GetElementRectInFlowRequest } from '../../../../../domain';
import { GetCanBeConnectedOutputByOutletRequest } from '../../get-can-be-connected-output-by-outlet';
import { RequiredOutput } from '../../../../../errors';
import { CreateConnectionDragHandlerRequest } from '../create-connection-drag-handler';

@Injectable()
@FExecutionRegister(CreateConnectionFromOutletPreparationRequest)
export class CreateConnectionFromOutletPreparationExecution
  implements IHandler<CreateConnectionFromOutletPreparationRequest, void> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FFlowMediator,
  ) {
  }

  public handle(request: CreateConnectionFromOutletPreparationRequest): void {
    const { event } = request;
    const node = this.fComponentsStore.findNode(event.targetElement)!;
    const pointerPositionInFlow = Point.fromPoint(event.getPosition()).elementTransform(this.flowHost);

    const outlet = this.fComponentsStore.fOutlets.find((x) => {
      return x.hostElement.contains(event.targetElement);
    });
    if (!outlet) {
      throw new Error('Outlet not found');
    }
    const nodeOutputs = this.fComponentsStore.fOutputs.filter((x) => node.isContains(x.hostElement));
    (outlet as FNodeOutletBase).setOutputs(nodeOutputs);

    if (outlet.canBeConnected) {

      const outletCenter = this.fMediator.send<IRect>(new GetElementRectInFlowRequest(outlet.hostElement)).gravityCenter;
      if ((outlet as FNodeOutletBase).isConnectionFromOutlet) {

        this.createDragHandler(pointerPositionInFlow, outlet, outletCenter);
      } else {
        const output = this.fMediator.send<FNodeOutputBase>(
          new GetCanBeConnectedOutputByOutletRequest(outlet as FNodeOutletBase)
        );
        if (!output) {
          throw RequiredOutput();
        }
        this.createDragHandler(pointerPositionInFlow, output, outletCenter);
      }
    }
  }

  private createDragHandler(position: IPoint, output: FConnectorBase, outletCenter: IPoint): void {
    this.fMediator.send(new CreateConnectionDragHandlerRequest(position, output, outletCenter));
  }
}
