import { IPoint, Point, PointExtensions, RectExtensions } from '@foblex/2d';
import { FComponentsStore, NotifyTransformChangedRequest } from '../../f-storage';
import { GetCanBeSelectedItemsRequest, ICanBeSelectedElementAndRect } from '../../domain';
import { FMediator } from '@foblex/mediator';
import { FDraggableDataContext, IFDragHandler } from '../../f-draggable';
import { FSelectionAreaBase } from '../f-selection-area-base';
import { ISelectable } from '../../mixins';

export class SelectionAreaDragHandle implements IFDragHandler {

  public fEventType: string = 'selection-area';

  private _canBeSelected: ICanBeSelectedElementAndRect[] = [];
  private _selectedByMove: ISelectable[] = [];

  private get _fCanvasPosition(): IPoint {
    return Point.fromPoint(this._store.fCanvas!.transform.position)
      .add(this._store.fCanvas!.transform.scaledPosition);
  }

  constructor(
    private _store: FComponentsStore,
    private _fSelectionArea: FSelectionAreaBase,
    private _dragContext: FDraggableDataContext,
    private _fMediator: FMediator,
  ) {
  }

  public prepareDragSequence(): void {
    this._canBeSelected = this._fMediator.execute(new GetCanBeSelectedItemsRequest());

    this._fSelectionArea.show();
    this._fSelectionArea.draw(
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

    const fSelectionAreaRect = RectExtensions.initialize(point.x, point.y, width, height);

    this._fSelectionArea.draw(fSelectionAreaRect);
    this._selectedByMove = [];
    this._canBeSelected.forEach((item) => {
      item.element.unmarkAsSelected();

      const fItemRect = RectExtensions.addPoint(item.fRect, this._fCanvasPosition);

      const isIntersect = RectExtensions.intersectionWithRect(fItemRect, fSelectionAreaRect);
      if (isIntersect) {

        item.element.markAsSelected();
        this._selectedByMove.push(item.element);
      }
    });
    this._fMediator.execute<void>(new NotifyTransformChangedRequest());
  }

  private _getMinimumPoint(point1: IPoint, point2: IPoint): IPoint {
    return PointExtensions.initialize(
      Math.min(point1.x, point2.x),
      Math.min(point1.y, point2.y),
    );
  }

  public onPointerUp(): void {
    this._fSelectionArea.hide();
    this._dragContext.selectedItems.push(...this._selectedByMove);
    if (this._selectedByMove.length > 0) {
      this._dragContext.isSelectedChanged = true;
    }
  }
}
