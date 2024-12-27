import { Directive } from '@angular/core';
import { IPoint, ITransformModel, Point, PointExtensions, RectExtensions } from '@foblex/2d';
import { IDraggableItem } from '../i-draggable-item';
import { FComponentsStore } from '../../f-storage';
import { INodeWithRect } from '../domain';
import { FDraggableDataContext } from '../f-draggable-data-context';

@Directive()
export class NodeDragToParentDragHandler implements IDraggableItem {

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  private onPointerDownPosition: IPoint = PointExtensions.initialize();

  public fNodeWithRect: INodeWithRect | null = null;

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private notDraggedNodesRects: INodeWithRect[],
  ) {
    this.onPointerDownPosition = this.fDraggableDataContext.onPointerDownPosition;
  }

  public move(difference: IPoint): void {
    let point = Point.fromPoint(this.onPointerDownPosition).add(difference).mult(this.transform.scale);
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
