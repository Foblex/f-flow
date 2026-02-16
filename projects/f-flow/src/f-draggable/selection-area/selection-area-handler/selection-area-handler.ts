import { IPoint, IRect, ITransformModel, Point, PointExtensions, RectExtensions } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { DragHandlerBase } from '../../infrastructure';
import { ISelectable } from '../../../mixins';
import { FComponentsStore, INSTANCES, NotifyTransformChangedRequest } from '../../../f-storage';
import { CalculateSelectableItemsRequest, ICanBeSelectedElementAndRect } from '../../../domain';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { inject, Injectable } from '@angular/core';
import { FSelectionAreaBase } from '../../../f-selection-area';

@Injectable()
export class SelectionAreaHandler extends DragHandlerBase<unknown> {
  protected readonly type = 'selection-area';
  protected readonly kind = 'selection-area';

  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _mediator = inject(FMediator);

  private _canBeSelected: ICanBeSelectedElementAndRect[] = [];
  private _selectedByMove: ISelectable[] = [];

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  private get _canvasPosition(): IPoint {
    return Point.fromPoint(this._transform.position).add(this._transform.scaledPosition);
  }

  private get _instance(): FSelectionAreaBase {
    return this._store.instances.require(INSTANCES.SELECTION_AREA);
  }

  public override prepareDragSequence(): void {
    this._canBeSelected = this._mediator.execute(new CalculateSelectableItemsRequest());

    this._show();
    this._draw(
      RectExtensions.initialize(
        this._dragSession.onPointerDownPosition.x,
        this._dragSession.onPointerDownPosition.y,
      ),
    );
  }

  public override onPointerMove(difference: IPoint): void {
    const currentPoint = Point.fromPoint(difference).add(this._dragSession.onPointerDownPosition);

    const point = this._getMinimumPoint(this._dragSession.onPointerDownPosition, currentPoint);

    const width = Math.abs(difference.x);
    const height = Math.abs(difference.y);

    const _selectionAreaRect = RectExtensions.initialize(point.x, point.y, width, height);

    this._draw(_selectionAreaRect);
    this._selectedByMove = [];
    this._canBeSelected.forEach((item) => {
      item.element.unmarkAsSelected();

      const _itemRect = RectExtensions.addPoint(item.fRect, this._canvasPosition);

      const isIntersect = RectExtensions.intersectionWithRect(_itemRect, _selectionAreaRect);
      if (isIntersect) {
        item.element.markAsSelected();
        this._selectedByMove.push(item.element);
      }
    });
    this._mediator.execute<void>(new NotifyTransformChangedRequest());
  }

  private _getMinimumPoint(point1: IPoint, point2: IPoint): IPoint {
    return PointExtensions.initialize(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
  }

  public override onPointerUp(): void {
    this._hide();
    this._dragSession.selectedItems.push(...this._selectedByMove);
    if (this._selectedByMove.length > 0) {
      this._dragSession.isSelectedChanged = true;
    }
  }

  private _draw(object: IRect): void {
    const style = this._instance.hostElement.style;
    style.left = object.x + 'px';
    style.top = object.y + 'px';
    style.width = object.width + 'px';
    style.height = object.height + 'px';
  }

  private _show(): void {
    this._instance.hostElement.style.display = 'block';
  }

  private _hide(): void {
    this._instance.hostElement.style.display = 'none';
  }
}
