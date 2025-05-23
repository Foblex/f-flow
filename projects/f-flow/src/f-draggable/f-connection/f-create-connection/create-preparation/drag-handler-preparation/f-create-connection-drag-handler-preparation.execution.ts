import { ITransformModel, Point } from '@foblex/2d';
import { IHandler } from '@foblex/mediator';
import { inject, Injectable, Injector } from '@angular/core';
import { FCreateConnectionDragHandlerPreparationRequest } from './f-create-connection-drag-handler-preparation.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../../f-draggable-data-context';
import { FCreateConnectionDragHandler } from '../../f-create-connection.drag-handler';

@Injectable()
@FExecutionRegister(FCreateConnectionDragHandlerPreparationRequest)
export class FCreateConnectionDragHandlerPreparationExecution
  implements IHandler<FCreateConnectionDragHandlerPreparationRequest, void> {

  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fDraggableDataContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  public handle(request: FCreateConnectionDragHandlerPreparationRequest): void {
    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    const positionRelativeToFlowComponent = Point.fromPoint(request.onPointerDownPosition)
      .elementTransform(this._fHost).div(this._transform.scale);
    this._fDraggableDataContext.onPointerDownPosition = positionRelativeToFlowComponent;

    const positionRelativeToCanvasComponent = Point.fromPoint(positionRelativeToFlowComponent).mult(this._transform.scale)
      .sub(this._transform.position).sub(this._transform.scaledPosition).div(this._transform.scale);

    this._fDraggableDataContext.draggableItems = [
      new FCreateConnectionDragHandler(
        this._injector, request.fOutputOrOutlet, positionRelativeToCanvasComponent
      )
    ];
  }
}
