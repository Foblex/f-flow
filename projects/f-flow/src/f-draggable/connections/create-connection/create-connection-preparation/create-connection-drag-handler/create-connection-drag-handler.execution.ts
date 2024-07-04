import { IHandler, ITransformModel, Point } from '@foblex/core';
import { Injectable } from '@angular/core';
import { CreateConnectionDragHandlerRequest } from './create-connection-drag-handler.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FFlowMediator } from '../../../../../infrastructure';
import { FDraggableDataContext } from '../../../../f-draggable-data-context';
import { CreateConnectionDragHandler } from '../../create-connection.drag-handler';

@Injectable()
@FExecutionRegister(CreateConnectionDragHandlerRequest)
export class CreateConnectionDragHandlerExecution
  implements IHandler<CreateConnectionDragHandlerRequest, void> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FFlowMediator,
  ) {
  }

  public handle(request: CreateConnectionDragHandlerRequest): void {
    this.fComponentsStore.fTempConnection!.fOutputId = request.connector.id;
    this.fComponentsStore.fTempConnection!.initialize();

    this.fDraggableDataContext.onPointerDownScale = this.transform.scale;

    this.fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.position).div(this.transform.scale);

    this.fDraggableDataContext.draggableItems = [
      new CreateConnectionDragHandler(this.fMediator, this.fComponentsStore.fTempConnection!, request.connectorCenter)
    ];
  }
}
