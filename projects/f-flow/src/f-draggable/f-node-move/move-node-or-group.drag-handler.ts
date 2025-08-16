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
import {HardSoftLimiter} from "./hard-soft-limiter";
import {ILimitEdges} from "./limit-bounds";

type SideGrow = { left: number; right: number; top: number; bottom: number };

export class MoveNodeOrGroupDragHandler implements IFDragHandler {

  public readonly fEventType = 'move-node';

  private readonly _onPointerDownPosition = PointExtensions.initialize();

  private readonly _store: FComponentsStore;
  private readonly _mediator: FMediator;

  private _limit: (diff: IPoint) => IPoint = (diff) => diff;

  private _maxGrowByParent = new Map<string, SideGrow>();

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

    const limiter = new HardSoftLimiter(this._injector, this._onPointerDownPosition, limits);

    this._limit = (difference: IPoint) => {
      const limitResult = limiter.limit(difference);

      limitResult.softResult.forEach((result, index) => {
        const grow = {x: Math.abs(result.overflow.x), y: Math.abs(result.overflow.y)};
        console.log(grow);
        const edges = result.edges;

        this.expandParentByOverflow(
          limits.soft[index].nodeOrGroup,
          grow,
          edges,
          limits.soft[index].boundingRect
        );
      });

      return limitResult.hard;
    }
  }

  public prepareDragSequence(): void {
    this.childrenNodeAndGroups.forEach((x) => x.prepareDragSequence());
    this.nodeOrGroup.hostElement.classList.add(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
  }

  public onPointerMove(difference: IPoint): void {
    const differenceWithRestrictions = this._limit(difference);

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

  public expandParentByOverflow(parent: FNodeBase, grow: IPoint, edges: ILimitEdges, boundingRect: IRect): void {

    let x = boundingRect.x, y = boundingRect.y, width = boundingRect.width, height = boundingRect.height;

    if (edges.right && grow.x > 0) {
      width += grow.x;
    }
    if (edges.bottom && grow.y > 0) {
      height += grow.y;
    }
    if (edges.left && grow.x > 0) {
      x -= grow.x;
      width += grow.x;
    }
    if (edges.top && grow.y > 0) {
      y -= grow.y;
      height += grow.y;
    }

    parent.updateSize({width, height});
    parent.updatePosition({x, y});
    parent.redraw();
  }

  private _getMaxGrow(parentId: string): SideGrow {
    let g = this._maxGrowByParent.get(parentId);
    if (!g) { g = { left: 0, right: 0, top: 0, bottom: 0 }; this._maxGrowByParent.set(parentId, g); }
    return g;
  }
}
