import { Directive } from '@angular/core';
import { FMediator } from '@foblex/mediator';
import { IPoint, ITransformModel, Point, PointExtensions, RectExtensions } from '@foblex/2d';
import { IDraggableItem } from '../i-draggable-item';
import { FComponentsStore } from '../../f-storage';
import { INodeWithRect } from '../domain';
import { FDraggableDataContext } from '../f-draggable-data-context';
import { FDroppedChildrenEvent } from './f-dropped-children.event';

@Directive()
export class NodeDragToParentDragHandler implements IDraggableItem {

  private get transform(): ITransformModel {
    return this.fComponentsStore.transform;
  }

  private get fCanvasPosition(): IPoint {
    return PointExtensions.sum(this.transform.position, this.transform.scaledPosition)
  }

  private onPointerDownPosition: IPoint = PointExtensions.initialize();

  public fNodeWithRect: INodeWithRect | null = null;

  constructor(
    private fMediator: FMediator,
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private notDraggedNodesRects: INodeWithRect[],
  ) {
    this.onPointerDownPosition = PointExtensions.sub(this.fDraggableDataContext.onPointerDownPosition, this.fCanvasPosition);
  }

  public move(difference: IPoint): void {
    const point = Point.fromPoint(this.onPointerDownPosition).add(difference);
    const isInclude = this.notDraggedNodesRects.findIndex((x) => RectExtensions.isIncludePoint(x.rect, point));
    if (isInclude !== -1) {
      this.markIncludeNode(this.notDraggedNodesRects[isInclude]);
    } else {
      this.unmarkIncludeNode();
    }
  }

  private markIncludeNode(nodeWithRect: INodeWithRect): void {
    this.unmarkIncludeNode();
    this.fNodeWithRect = nodeWithRect;
    nodeWithRect.node.setClass('f-parent-for-drop');
  }

  private unmarkIncludeNode(): void {
    if(this.fNodeWithRect) {
      this.fNodeWithRect.node.removeClass('f-parent-for-drop');
    }
    this.fNodeWithRect = null;
  }

  public complete(): void {
    this.unmarkIncludeNode();
  }
}
