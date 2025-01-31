import { ITransformModel, Point } from '@foblex/2d';
import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { CreateConnectionDragHandlerPreparationRequest } from './create-connection-drag-handler-preparation.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../../f-draggable-data-context';
import { CreateConnectionDragHandler } from '../../create-connection.drag-handler';

@Injectable()
@FExecutionRegister(CreateConnectionDragHandlerPreparationRequest)
export class CreateConnectionDragHandlerPreparationExecution
  implements IHandler<CreateConnectionDragHandlerPreparationRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  public handle(request: CreateConnectionDragHandlerPreparationRequest): void {
    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    const positionRelativeToFlowComponent = Point.fromPoint(request.onPointerDownPosition)
      .elementTransform(this._fHost).div(this._transform.scale);
    this._fDraggableDataContext.onPointerDownPosition = positionRelativeToFlowComponent;

    const positionRelativeToCanvasComponent = Point.fromPoint(positionRelativeToFlowComponent).mult(this._transform.scale)
      .sub(this._transform.position).sub(this._transform.scaledPosition).div(this._transform.scale);

    this._fDraggableDataContext.draggableItems = [
      new CreateConnectionDragHandler(request.fOutputOrOutlet, positionRelativeToCanvasComponent)
    ];
  }
}
