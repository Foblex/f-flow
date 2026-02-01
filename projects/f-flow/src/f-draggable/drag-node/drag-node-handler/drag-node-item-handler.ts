import { IPoint, IRect, PointExtensions, RectExtensions } from '@foblex/2d';
import { Injector } from '@angular/core';
import { FMediator } from '@foblex/mediator';
import { DragHandlerBase } from '../../infrastructure';
import {
  DragNodeDeltaConstraints,
  expandRectByOverflow,
  IDeltaClampResult,
  IDragNodeDeltaConstraints,
} from '../drag-node-constraint';
import { FNodeBase } from '../../../f-node';
import { DragNodeConnectionHandlerBase } from '../drag-node-dependent-connection-handlers';
import { F_CSS_CLASS, GetNormalizedElementRectRequest } from '../../../domain';

export class DragNodeItemHandler extends DragHandlerBase<unknown> {
  protected readonly type = 'move-node';
  protected readonly kind = 'drag-node';

  private readonly _startPosition = PointExtensions.initialize();
  private readonly _startRect = RectExtensions.initialize();

  private _applyConstraints: (delta: IPoint) => IPoint = (delta) => delta;

  private _lastSoftResults: IDeltaClampResult[] = [];
  private _deltaConstraints!: DragNodeDeltaConstraints;

  private _constraints!: IDragNodeDeltaConstraints;
  private _lastPosition = PointExtensions.initialize();

  private readonly _mediator: FMediator;

  constructor(
    private readonly _injector: Injector,
    public readonly nodeOrGroup: FNodeBase,

    public children: DragNodeItemHandler[] = [],
    public sourceConnectionHandlers: DragNodeConnectionHandlerBase[] = [],
    public targetConnectionHandlers: DragNodeConnectionHandlerBase[] = [],
  ) {
    super();

    this._mediator = _injector.get(FMediator);

    this._startRect = this._mediator.execute(
      new GetNormalizedElementRectRequest(nodeOrGroup.hostElement),
    );
    this._startPosition = { ...nodeOrGroup._position };
  }

  public setConstraints(constraints: IDragNodeDeltaConstraints): void {
    this._constraints = constraints;
    this._deltaConstraints = new DragNodeDeltaConstraints(
      this._injector,
      this._startPosition,
      constraints,
    );

    this._applyConstraints = (difference) => {
      const summary = this._deltaConstraints.apply(difference);
      this._applySoftExpansions(summary.soft);

      return summary.hardDelta;
    };
  }

  public finalizeConstraints(): void {
    // in finalize we force snap and commit expansions based on finalized delta
    this._applyConstraints = (delta) => {
      const summary = this._deltaConstraints.finalize(delta);
      this._applySoftExpansions(summary.soft);

      return summary.hardDelta;
    };
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
    for (const child of this.children) {
      child.prepareDragSequence();
    }

    this.nodeOrGroup.hostElement.classList.add(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
  }

  public override onPointerMove(delta: IPoint): void {
    const constrained = this._applyConstraints(delta);

    for (const child of this.children) {
      child.onPointerMove(constrained);
    }

    this._redraw(this._startPlus(constrained));

    for (const h of this.sourceConnectionHandlers) {
      h.setSourceDelta(constrained);
    }
    for (const h of this.targetConnectionHandlers) {
      h.setTargetDelta(constrained);
    }
  }

  public override onPointerUp(): void {
    for (const child of this.children) {
      child.onPointerUp();
    }

    this.nodeOrGroup.position.set(this.nodeOrGroup._position);
    this.nodeOrGroup.hostElement.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);

    this._emitExpandedEvent();
  }

  private _startPlus(delta: IPoint): IPoint {
    return PointExtensions.sum(this._startPosition, delta);
  }

  private _redraw(position: IPoint): void {
    this._lastPosition = position;
    this.nodeOrGroup.updatePosition(position);
    this.nodeOrGroup.redraw();
  }

  private _applySoftExpansions(results: IDeltaClampResult[]): void {
    this._lastSoftResults = results;

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const soft = this._constraints.soft[i];

      const expandedRect = expandRectByOverflow(soft.boundingRect, r.overflow, r.edges);

      this._commitParentRect(soft.nodeOrGroup, expandedRect);
    }
  }

  private _commitParentRect(parent: FNodeBase, rect: IRect): void {
    parent.updateSize({ width: rect.width, height: rect.height });
    parent.updatePosition({ x: rect.x, y: rect.y });
    parent.redraw();
  }

  private _emitExpandedEvent(): void {
    for (let i = 0; i < this._lastSoftResults.length; i++) {
      const r = this._lastSoftResults[i];
      if (!r.overflow.x && !r.overflow.y) {
        continue;
      }

      const soft = this._constraints.soft[i];
      const expandedRect = expandRectByOverflow(soft.boundingRect, r.overflow, r.edges);

      soft.nodeOrGroup.sizeChange.emit(expandedRect);
    }
  }

  public override destroy(): void {
    for (const child of this.children) {
      child.destroy?.();
    }

    this.children = [];
    this.sourceConnectionHandlers = [];
    this.targetConnectionHandlers = [];

    // this._constraints = null;
    this._lastSoftResults = [];
    this._applyConstraints = (d) => d;
  }
}
