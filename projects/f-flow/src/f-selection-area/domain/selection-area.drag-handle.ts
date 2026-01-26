import { IPoint, ITransformModel, Point, PointExtensions, RectExtensions } from '@foblex/2d';
import { FComponentsStore, NotifyTransformChangedRequest } from '../../f-storage';
import { CalculateSelectableItemsRequest, ICanBeSelectedElementAndRect } from '../../domain';
import { FMediator } from '@foblex/mediator';
import { FDraggableDataContext, IFDragHandler } from '../../f-draggable';
import { FSelectionAreaBase } from '../f-selection-area-base';
import { ISelectable } from '../../mixins';

export class SelectionAreaDragHandle implements IFDragHandler {
  public readonly fEventType = 'selection-area';

  private _canBeSelected: ICanBeSelectedElementAndRect[] = [];
  private _selectedByMove: ISelectable[] = [];

  private get _transform(): ITransformModel {
    return this._store.fCanvas?.transform as ITransformModel;
  }

  private get _canvasPosition(): IPoint {
    return Point.fromPoint(this._transform.position).add(this._transform.scaledPosition);
  }

  constructor(
    private _store: FComponentsStore,
    private _selectionArea: FSelectionAreaBase,
    private _dragContext: FDraggableDataContext,
    private _mediator: FMediator,
  ) {}

  public prepareDragSequence(): void {
    this._canBeSelected = this._mediator.execute(new CalculateSelectableItemsRequest());

    this._selectionArea.show();
    this._selectionArea.draw(
      RectExtensions.initialize(
        this._dragContext.onPointerDownPosition.x,
        this._dragContext.onPointerDownPosition.y,
      ),
    );
  }

  public onPointerMove(difference: IPoint): void {
    const currentPoint = Point.fromPoint(difference).add(this._dragContext.onPointerDownPosition);

    const point = this._getMinimumPoint(this._dragContext.onPointerDownPosition, currentPoint);

    const width = Math.abs(difference.x);
    const height = Math.abs(difference.y);

    const _selectionAreaRect = RectExtensions.initialize(point.x, point.y, width, height);

    this._selectionArea.draw(_selectionAreaRect);
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

  public onPointerUp(): void {
    this._selectionArea.hide();
    this._dragContext.selectedItems.push(...this._selectedByMove);
    if (this._selectedByMove.length > 0) {
      this._dragContext.isSelectedChanged = true;
    }
  }
}
