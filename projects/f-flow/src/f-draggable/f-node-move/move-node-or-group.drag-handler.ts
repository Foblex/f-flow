import {IMinMaxPoint, IPoint, IRect, PointExtensions} from '@foblex/2d';
import {IFDragHandler} from '../f-drag-handler';
import {FNodeBase} from '../../f-node';
import {BaseConnectionDragHandler} from './connection-drag-handlers';
import {F_CSS_CLASS, GetParentNodesRequest} from "../../domain";
import {PointBoundsLimiter} from "./point-bounds-limiter";
import {Injector} from "@angular/core";
import {FComponentsStore} from "../../f-storage";
import {EFBoundsMode} from "../enums";
import {FMediator} from "@foblex/mediator";

export class MoveNodeOrGroupDragHandler implements IFDragHandler {

  public readonly fEventType = 'move-node';

  private readonly _onPointerDownPosition = PointExtensions.initialize();

  private _parentsChain: FNodeBase[] = [];
  private readonly _store: FComponentsStore;
  private readonly _mediator: FMediator;
  private _limit: (diff: IPoint) => IPoint = (diff) => diff;

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

  public setLimits(limits: IMinMaxPoint): void {
    // If the bounds mode is set to halt on any hit, we do not apply individual limits and use the summary limits instead.
    if (this._store.fDraggable?.fBoundsMode() === EFBoundsMode.HaltOnAnyHit) {
      return;
    }
    this._parentsChain = this._collectParentsChain();
    this._limit = (diff: IPoint) => new PointBoundsLimiter(this._injector, this._boundingRect, limits)
      .limit(diff, this._store.fDraggable!.fCellSizeWhileDragging());
  }

  private _collectParentsChain(): FNodeBase[] {
    const chain = this._mediator.execute<FNodeBase[] | undefined>(
      new GetParentNodesRequest(this.nodeOrGroup)
    );
    if (chain?.length) return chain;
    const map = new Map(this._store.fNodes.map(n => [n.fId(), n] as const));
    const res: FNodeBase[] = [];
    let pid = this.nodeOrGroup.fParentId?.();
    while (pid) {
      const p = map.get(pid);
      if (!p) break;
      res.push(p);
      pid = p.fParentId?.();
    }
    return res;
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
}
