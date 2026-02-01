import { IPoint, IRect, PointExtensions, RectExtensions } from '@foblex/2d';
import { DragHandlerBase } from '../infrastructure';
import { FNodeBase } from '../../f-node';
import { DragNodeConnectionHandlerBase } from './drag-node-dependent-connection-handlers';
import { F_CSS_CLASS, GetNormalizedElementRectRequest } from '../../domain';
import { Injector } from '@angular/core';
import {
  DragNodeDeltaConstraints,
  expandRectByOverflow,
  IDeltaClampResult,
  IDragNodeDeltaConstraints,
} from './drag-node-constraint';
import { FMediator } from '@foblex/mediator';

export class DragNodeItemHandler extends DragHandlerBase<unknown> {
  protected readonly type = 'move-node';
  protected readonly kind = 'drag-nodes';

  private readonly _startPosition = PointExtensions.initialize();
  private readonly _startRect = RectExtensions.initialize();

  private _applyConstraints: (difference: IPoint) => IPoint = (difference) => difference;

  private _lastSoftResults: IDeltaClampResult[] = [];
  private _deltaConstraints!: DragNodeDeltaConstraints;
  private _limits: IDragNodeDeltaConstraints | null = null;
  private _lastPosition = PointExtensions.initialize();

  constructor(
    private readonly _injector: Injector,
    public nodeOrGroup: FNodeBase,
    public childrenNodeAndGroups: DragNodeItemHandler[] = [],
    public fSourceHandlers: DragNodeConnectionHandlerBase[] = [],
    public fTargetHandlers: DragNodeConnectionHandlerBase[] = [],
  ) {
    super();
    this._startRect = _injector
      .get(FMediator)
      .execute(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
    this._startPosition = { ...nodeOrGroup._position };
  }

  public setLimits(limits: IDragNodeDeltaConstraints): void {
    this._limits = limits;
    this._deltaConstraints = new DragNodeDeltaConstraints(
      this._injector,
      this._startPosition,
      limits,
    );

    this._applyConstraints = (difference) => {
      const summary = this._deltaConstraints.apply(difference);
      this._applySoftExpansions(summary.soft);

      return summary.hardDelta;
    };
  }

  private _applySoftExpansions(softResults: IDeltaClampResult[]): void {
    this._lastSoftResults = softResults;
    this._lastSoftResults.forEach((result, index) => {
      const softLimit = this._limits!.soft[index];
      const expandedRect = expandRectByOverflow(
        softLimit.boundingRect,
        result.overflow,
        result.edges,
      );
      this._commitParentRect(softLimit.nodeOrGroup, expandedRect);
    });
  }

  private _commitParentRect(parent: FNodeBase, rect: IRect): void {
    parent.updateSize({ width: rect.width, height: rect.height });
    parent.updatePosition({ x: rect.x, y: rect.y });
    parent.redraw();
  }

  public getLastRect(): IRect {
    return RectExtensions.initialize(
      this._lastPosition.x,
      this._lastPosition.y,
      this._startRect.width,
      this._startRect.height,
    );
  }

  public override prepareDragSequence(): void {
    this.childrenNodeAndGroups.forEach((x) => x.prepareDragSequence());
    this.nodeOrGroup.hostElement.classList.add(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
  }

  public onPointerMove(difference: IPoint): void {
    const differenceWithRestrictions = this._applyConstraints(difference);

    this.childrenNodeAndGroups.forEach((x) => x.onPointerMove(differenceWithRestrictions));
    this._redraw(this._nodeOrGroupNewPosition(differenceWithRestrictions));

    this.fSourceHandlers.forEach((x) => x.setSourceDelta(differenceWithRestrictions));
    this.fTargetHandlers.forEach((x) => x.setTargetDelta(differenceWithRestrictions));
  }

  public assignFinalConstraints(): void {
    this._applyConstraints = (difference: IPoint) => {
      const summary = this._deltaConstraints.finalize(difference);
      this._applySoftExpansions(summary.soft);

      return summary.hardDelta;
    };
  }

  private _nodeOrGroupNewPosition(difference: IPoint): IPoint {
    return PointExtensions.sum(this._startPosition, difference);
  }

  private _redraw(position: IPoint): void {
    this._lastPosition = position;
    this.nodeOrGroup.updatePosition(position);
    this.nodeOrGroup.redraw();
  }

  public override onPointerUp(): void {
    this.childrenNodeAndGroups.forEach((x) => x.onPointerUp());
    this.nodeOrGroup.position.set(this.nodeOrGroup._position);
    this.nodeOrGroup.hostElement.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
    this._emitEventIfNodeExpanded();
  }

  private _emitEventIfNodeExpanded(): void {
    this._lastSoftResults.forEach((result, index) => {
      const softLimit = this._limits!.soft[index];
      const expandedRect = expandRectByOverflow(
        softLimit.boundingRect,
        result.overflow,
        result.edges,
      );
      if (result.overflow.x || result.overflow.y) {
        softLimit.nodeOrGroup.sizeChange.emit(expandedRect);
      }
    });
  }

  public override destroy(): void {
    this.fSourceHandlers = []; // Clear references to avoid memory leaks
    this.fTargetHandlers = []; // Clear references to avoid memory leaks
  }
}
