import { IPoint, IRect, PointExtensions, RectExtensions } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { FNodeBase } from '../../f-node';
import { BaseConnectionDragHandler } from './connection-drag-handlers';
import { F_CSS_CLASS, GetNormalizedElementRectRequest } from "../../domain";
import { Injector } from "@angular/core";
import { IDragLimits } from "./create-drag-model-from-selection";
import { DragConstraintPipeline, expandRectFromBaseline, IConstraintResult } from "./constraint";
import { FMediator } from "@foblex/mediator";

export class MoveDragHandler implements IFDragHandler {

  public readonly fEventType = 'move-node';

  private readonly _startPosition = PointExtensions.initialize();
  private readonly _startRect = RectExtensions.initialize();

  private _applyConstraints: (difference: IPoint) => IPoint = (difference) => difference;

  private _lastSoftResults: IConstraintResult[] = [];
  private _pipeline!: DragConstraintPipeline;
  private _limits: IDragLimits | null = null;
  private _lastPosition = PointExtensions.initialize();

  constructor(
    private readonly _injector: Injector,
    public nodeOrGroup: FNodeBase,
    public childrenNodeAndGroups: MoveDragHandler[] = [],
    public fSourceHandlers: BaseConnectionDragHandler[] = [],
    public fTargetHandlers: BaseConnectionDragHandler[] = [],
  ) {
    this._startRect = _injector.get(FMediator).execute(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement))
    this._startPosition = { ...nodeOrGroup._position };
  }

  public setLimits(limits: IDragLimits): void {
    this._limits = limits;
    this._pipeline = new DragConstraintPipeline(this._injector, this._startPosition, limits);

    this._applyConstraints = (difference: IPoint) => {
      const summary = this._pipeline.apply(difference);
      this._applySoftExpansions(summary.soft);

      return summary.hardDifference;
    }
  }

  private _applySoftExpansions(
    softResults: IConstraintResult[],
  ): void {
    this._lastSoftResults = softResults;
    this._lastSoftResults.forEach((result, index) => {
      const softLimit = this._limits!.soft[index];
      const expandedRect = expandRectFromBaseline(softLimit.boundingRect, result.overflow, result.edges);
      this._commitParentRect(softLimit.nodeOrGroup, expandedRect);
    });
  }

  private _commitParentRect(parent: FNodeBase, rect: IRect): void {
    parent.updateSize({ width: rect.width, height: rect.height });
    parent.updatePosition({ x: rect.x, y: rect.y });
    parent.redraw();
  }

  public getLastRect(): IRect {
    return RectExtensions.initialize(this._lastPosition.x, this._lastPosition.y, this._startRect.width, this._startRect.height);
  }

  public prepareDragSequence(): void {
    this.childrenNodeAndGroups.forEach((x) => x.prepareDragSequence());
    this.nodeOrGroup.hostElement.classList.add(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
  }

  public onPointerMove(difference: IPoint): void {
    const differenceWithRestrictions = this._applyConstraints(difference);

    this.childrenNodeAndGroups.forEach((x) => x.onPointerMove(differenceWithRestrictions));
    this._redraw(this._nodeOrGroupNewPosition(differenceWithRestrictions));

    this.fSourceHandlers.forEach((x) => x.setSourceDifference(differenceWithRestrictions));
    this.fTargetHandlers.forEach((x) => x.setTargetDifference(differenceWithRestrictions));
  }

  public assignFinalConstraints(): void {
    this._applyConstraints = (difference: IPoint) => {
      const summary = this._pipeline.finalize(difference);
      this._applySoftExpansions(summary.soft);

      return summary.hardDifference;
    }
  }

  private _nodeOrGroupNewPosition(difference: IPoint): IPoint {
    return PointExtensions.sum(this._startPosition, difference);
  }

  private _redraw(position: IPoint): void {
    this._lastPosition = position;
    this.nodeOrGroup.updatePosition(position);
    this.nodeOrGroup.redraw();
  }

  public onPointerUp(): void {
    this.childrenNodeAndGroups.forEach((x) => x.onPointerUp());
    this.nodeOrGroup.position.set(this.nodeOrGroup._position);
    this.nodeOrGroup.hostElement.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
    this._emitEventIfNodeExpanded();
  }

  private _emitEventIfNodeExpanded(): void {
    this._lastSoftResults.forEach((result, index) => {
      const softLimit = this._limits!.soft[index];
      const expandedRect = expandRectFromBaseline(softLimit.boundingRect, result.overflow, result.edges);
      if (result.overflow.x || result.overflow.y) {
        softLimit.nodeOrGroup.sizeChange.emit(expandedRect);
      }
    });
  }
}
