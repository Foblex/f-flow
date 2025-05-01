import { inject, Injectable, Injector } from '@angular/core';
import { FNodeDropToGroupPreparationRequest } from './f-node-drop-to-group-preparation.request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { INodeWithRect } from '../../domain';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { GetNormalizedElementRectRequest, GetParentNodesRequest } from '../../../domain';
import { FNodeBase } from '../../../f-node';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeDropToGroupDragHandler } from '../f-node-drop-to-group.drag-handler';
import { FSummaryNodeMoveDragHandler } from '../../f-node-move';

@Injectable()
@FExecutionRegister(FNodeDropToGroupPreparationRequest)
export class FNodeDropToGroupPreparationExecution
  implements IExecution<FNodeDropToGroupPreparationRequest, void> {

  private readonly _fMediator = inject(FMediator);
  private readonly _fDraggableDataContext = inject(FDraggableDataContext);
  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _injector = inject(Injector);

  private get _fNodes(): FNodeBase[] {
    return this._fComponentsStore.fNodes;
  }

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  private get _fCanvasPosition(): IPoint {
    return PointExtensions.sum(this._transform.position, this._transform.scaledPosition)
  }

  public handle(request: FNodeDropToGroupPreparationRequest): void {
    if(!this._isValid()) {
      return;
    }
    const fNode = this._fComponentsStore
      .fNodes.find(n => n.isContains(request.event.targetElement));
    if (!fNode) {
      throw new Error('Node not found');
    }

    this._fDraggableDataContext.draggableItems.push(
      new FNodeDropToGroupDragHandler(
        this._injector,
        this._getNotDraggedNodesRects()
      )
    );
  }

  private _isValid(): boolean {
    return this._fDraggableDataContext.draggableItems
      .some((x) => x instanceof FSummaryNodeMoveDragHandler);
  }

  private _getNotDraggedNodesRects(): INodeWithRect[] {
    const draggedNodes = this._addParentNodes(this._getNodesBeingDragged());
    return this._getNotDraggedNodes(draggedNodes).map((x) => {
      const rect = this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement, false));
      return {
        node: x,
        rect: RectExtensions.initialize(
          rect.x * this._transform.scale + this._fCanvasPosition.x,
          rect.y * this._transform.scale + this._fCanvasPosition.y,
          rect.width * this._transform.scale,
          rect.height * this._transform.scale
        )
      }
    });
  }

  private _getNodesBeingDragged(): FNodeBase[] {
    return this._fDraggableDataContext.draggableItems
      .find((x) => x instanceof FSummaryNodeMoveDragHandler)!
      .fHandlers.map((x) => x.fNode);
  }

  private _addParentNodes(fNodes: FNodeBase[]): FNodeBase[] {
    return fNodes.reduce((result: FNodeBase[], x: FNodeBase) => {
      result.push(x, ...this._fMediator.execute<FNodeBase[]>(new GetParentNodesRequest(x)));
      return result;
    }, []);
  }

  private _getNotDraggedNodes(draggedNodes: FNodeBase[]): FNodeBase[] {
    return this._fNodes.filter((x) => !draggedNodes.includes(x));
  }
}
