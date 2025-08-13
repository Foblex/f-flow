import {Directive, Injector} from '@angular/core';
import {IPoint, ITransformModel, Point, PointExtensions, RectExtensions} from '@foblex/2d';
import {IFDragHandler} from '../f-drag-handler';
import {FComponentsStore} from '../../f-storage';
import {INodeWithRect} from '../domain';
import {FDraggableDataContext} from '../f-draggable-data-context';
import {F_CSS_CLASS} from "../../domain";

@Directive()
export class FNodeDropToGroupDragHandler implements IFDragHandler {

  private readonly _store: FComponentsStore;

  public fEventType = 'move-node-to-parent';

  private _DEBOUNCE_TIME = 1;

  private get _transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  private _onPointerDownPosition: IPoint = PointExtensions.initialize();
  private _debounceTimer: any = null;

  public fNodeWithRect: INodeWithRect | null = null;

  constructor(
    _injector: Injector,
    private containersForDrop: INodeWithRect[],
  ) {
    this._store = _injector.get(FComponentsStore);
    this._onPointerDownPosition = _injector.get(FDraggableDataContext).onPointerDownPosition;
  }

  public prepareDragSequence(): void {
    this.containersForDrop.forEach(({node}) => {
      node.hostElement.classList.add(F_CSS_CLASS.GROUPING.DROP_ACTIVE);
    });
  }

  private _toggleParentNode(difference: IPoint): void {
    const isInclude = this._isNodeInsideAnotherNode(this._getNewPosition(difference));
    if (isInclude) {
      this._markIncludeNode(isInclude);
    } else {
      this._unmarkIncludeNode();
    }
  }

  private _getNewPosition(difference: IPoint): IPoint {
    return Point.fromPoint(this._onPointerDownPosition).add(difference).mult(this._transform.scale);
  }

  private _isNodeInsideAnotherNode(point: IPoint): INodeWithRect | undefined {
    return this.containersForDrop.find((x) => RectExtensions.isIncludePoint(x.rect, point));
  }

  public onPointerMove(difference: IPoint): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = setTimeout(() => this._toggleParentNode(difference), this._DEBOUNCE_TIME);
  }

  private _markIncludeNode(nodeWithRect: INodeWithRect): void {
    this._unmarkIncludeNode();
    this.fNodeWithRect = nodeWithRect;
    nodeWithRect.node.setClass(F_CSS_CLASS.GROUPING.OVER_BOUNDARY);
  }

  private _unmarkIncludeNode(): void {
    this.fNodeWithRect?.node.removeClass(F_CSS_CLASS.GROUPING.OVER_BOUNDARY);
    this.fNodeWithRect = null;
  }

  public onPointerUp(): void {
    this._unmarkIncludeNode();
    this.containersForDrop.forEach(({node}) => {
      node.hostElement.classList.remove(F_CSS_CLASS.GROUPING.DROP_ACTIVE);
    });
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
  }
}
