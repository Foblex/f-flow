import {IMinMaxPoint, IPoint, IRect} from '@foblex/2d';
import {IFDragHandler} from '../f-drag-handler';
import {FComponentsStore} from '../../f-storage';
import {PointBoundsLimiter} from './point-bounds-limiter';
import {MoveNodeOrGroupDragHandler} from './move-node-or-group.drag-handler';
import {Injector} from '@angular/core';
import {EFBoundsMode} from "../enums";

export class MoveSummaryDragHandler implements IFDragHandler {

  public readonly fEventType = 'move-node';
  public readonly fData: any;

  private readonly _store: FComponentsStore;
  private _limit: (diff: IPoint) => IPoint = (diff) => diff;

  constructor(
    private readonly _injector: Injector,
    public limits: IMinMaxPoint,
    public dragHandlers: MoveNodeOrGroupDragHandler[],
    public boundingRect: IRect
  ) {
    this._store = _injector.get(FComponentsStore);
    this.fData = {
      fNodeIds: this.dragHandlers.map((x) => x.nodeOrGroup.fId())
    };
    this._setLimits(limits);
  }

  private _setLimits(limits: IMinMaxPoint): void {
    // If the bounds mode is set to clamp individually, we do not apply summary limits.
    if (this._store.fDraggable?.fBoundsMode() === EFBoundsMode.ClampIndividually) {
      return;
    }
    this._limit = (diff: IPoint) => new PointBoundsLimiter(this._injector, this.boundingRect, limits)
      .limit(diff, this._store.fDraggable!.fCellSizeWhileDragging());
  }

  public prepareDragSequence(): void {
    this.dragHandlers.forEach((x) => x.prepareDragSequence());
  }

  public onPointerMove(difference: IPoint): void {
    this.dragHandlers.forEach((x) => {
      x.onPointerMove(this._limit(difference));
    });
  }

  public onPointerUp(): void {
    this.dragHandlers.forEach((x) => x.onPointerUp());
  }

  // public calculateRestrictedDifference(difference: IPoint): IPoint {
  //   return this._boundsLimiter.limit(difference, true);
  // }
}
