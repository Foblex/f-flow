import {IPoint, IRect, PointExtensions} from '@foblex/2d';
import {IFDragHandler} from '../f-drag-handler';
import {FNodeBase} from '../../f-node';
import {BaseConnectionDragHandler} from './connection-drag-handlers';
import {F_CSS_CLASS} from "../../domain";
import {Injector} from "@angular/core";
import {FComponentsStore} from "../../f-storage";
import {EFBoundsMode} from "../enums";
import {FMediator} from "@foblex/mediator";
import {IDragLimits} from "./create-drag-model-from-selection";
import {DragConstraintPipeline, expandRectFromBaseline, IConstraintResult} from "./constraint";

export class MoveNodeOrGroupDragHandler implements IFDragHandler {

  public readonly fEventType = 'move-node';

  private readonly _onPointerDownPosition = PointExtensions.initialize();

  private readonly _store: FComponentsStore;
  private readonly _mediator: FMediator;

  private _applyConstraints: (difference: IPoint) => IPoint = (difference) => difference;

  constructor(
    private readonly _injector: Injector,
    private readonly _boundingRect: IRect,
    public nodeOrGroup: FNodeBase,
    public childrenNodeAndGroups: MoveNodeOrGroupDragHandler[] = [],
    public fSourceHandlers: BaseConnectionDragHandler[] = [],
    public fTargetHandlers: BaseConnectionDragHandler[] = [],
  ) {
    this._onPointerDownPosition = {...nodeOrGroup._position};
    this._store = _injector.get(FComponentsStore);
    this._mediator = _injector.get(FMediator);
  }

  public setLimits(limits: IDragLimits): void {
    // If the bounds mode is set to halt on any hit, we do not apply individual limits and use the summary limits instead.
    if (this._store.fDraggable?.fBoundsMode() === EFBoundsMode.HaltOnAnyHit) {
      return;
    }

    const pipeline = new DragConstraintPipeline(this._injector, this._onPointerDownPosition, limits);

    this._applyConstraints = (difference: IPoint) => {
      const summary = pipeline.apply(difference);

      this._applySoftExpansions(summary.soft, limits);

      return summary.hardDifference;
    }
  }

  private _applySoftExpansions(
    softResults: IConstraintResult[], limits: IDragLimits
  ): void {
    softResults.forEach((result, index) => {
      const softLimit = limits.soft[index];
      const expandedRect = expandRectFromBaseline(softLimit.boundingRect, result.overflow, result.edges);
      this._commitParentRect(softLimit.nodeOrGroup, expandedRect);
    });
  }

  private _commitParentRect(parent: FNodeBase, rect: IRect): void {
    parent.updateSize({width: rect.width, height: rect.height});
    parent.updatePosition({x: rect.x, y: rect.y});
    parent.redraw();
  }

  public prepareDragSequence(): void {
    this.childrenNodeAndGroups.forEach((x) => x.prepareDragSequence());
    this.nodeOrGroup.hostElement.classList.add(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
  }

  public onPointerMove(difference: IPoint): void {
    const differenceWithRestrictions = this._applyConstraints(difference);

    this.childrenNodeAndGroups.forEach((x) => x.onPointerMove(differenceWithRestrictions));
    this._redraw(this._calculateNewPosition(differenceWithRestrictions));

    this.fSourceHandlers.forEach((x) => x.setSourceDifference(differenceWithRestrictions));
    this.fTargetHandlers.forEach((x) => x.setTargetDifference(differenceWithRestrictions));
  }

  private _calculateNewPosition(difference: IPoint): IPoint {
    return PointExtensions.sum(this._onPointerDownPosition, difference);
  }

  private _redraw(position: IPoint): void {
    this.nodeOrGroup.updatePosition(position);
    this.nodeOrGroup.redraw();
  }

  public onPointerUp(): void {
    this.childrenNodeAndGroups.forEach((x) => x.onPointerUp());
    this.nodeOrGroup.position.set(this.nodeOrGroup._position);
    this.nodeOrGroup.hostElement.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
  }
}
