import { IPoint, ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, IHandler } from '@foblex/mediator';
import { inject, Injectable, Injector } from '@angular/core';
import { CreateConnectionCreateDragHandlerRequest } from './create-connection-create-drag-handler-request';
import { FComponentsStore } from '../../../../../f-storage';
import { FDraggableDataContext } from '../../../../f-draggable-data-context';
import { CreateConnectionHandler } from '../../create-connection-handler';

@Injectable()
@FExecutionRegister(CreateConnectionCreateDragHandlerRequest)
export class CreateConnectionCreateDragHandler
  implements IHandler<CreateConnectionCreateDragHandlerRequest, void>
{
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle(request: CreateConnectionCreateDragHandlerRequest): void {
    this._dragContext.onPointerDownScale = this._transform.scale;

    const pointerDownInFlowSpace = this._toFlowSpace(request.eventPosition);
    this._dragContext.onPointerDownPosition = pointerDownInFlowSpace;

    // 2) Convert to canvas-local space for connection creation handler
    const pointerDownInCanvasSpace = this._toCanvasSpace(pointerDownInFlowSpace);

    this._dragContext.draggableItems = [
      new CreateConnectionHandler(this._injector, request.source, pointerDownInCanvasSpace),
    ];
  }

  /**
   * Converts raw pointer position to "flow host space":
   * - applies elementTransform(flowHost)
   * - normalizes by scale
   */
  private _toFlowSpace(position: IPoint): Point {
    return Point.fromPoint(position)
      .elementTransform(this._store.flowHost)
      .div(this._transform.scale);
  }

  /**
   * Converts from flow space to "canvas local space":
   * - removes transform offsets (position, scaledPosition)
   * - keeps normalization consistent
   *
   * (Same math as your original chain, just named.)
   */
  private _toCanvasSpace(flowSpace: IPoint): Point {
    return Point.fromPoint(flowSpace)
      .mult(this._transform.scale)
      .sub(this._transform.position)
      .sub(this._transform.scaledPosition)
      .div(this._transform.scale);
  }
}
