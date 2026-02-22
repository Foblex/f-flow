import { IPoint, IRect, IRoundedRect, RectExtensions } from '@foblex/2d';
import { DragHandlerBase } from '../../infrastructure';
import { EFResizeHandleType, FNodeBase } from '../../../f-node';
import { FMediator } from '@foblex/mediator';
import { CalculateResizeLimitsRequest } from '../calculate-resize-limits';
import { ApplyChildResizeConstraintsRequest } from '../apply-child-resize-constraints';
import { CalculateChangedRectFromDifferenceRequest } from '../calculate-changed-rect-from-difference';
import { ApplyParentResizeConstraintsRequest } from '../apply-parent-resize-constraints';
import {
  GetNormalizedConnectorRectRequest,
  GetNormalizedElementRectRequest,
} from '../../../domain';
import { inject, Injectable } from '@angular/core';
import { IResizeConstraint } from '../constraint';
import { FResizeNodeStartEventData } from '../f-resize-node-start-event-data';
import { RESIZE_NODE_HANDLER_KIND, RESIZE_NODE_HANDLER_TYPE } from '../is-resize-node-handler';
import { FGeometryCache } from '../../../domain/geometry-cache';
import { IResizeNodeConnectionHandlers } from './i-resize-node-connection-handlers';
import { FConnectorBase } from '../../../f-connectors';

@Injectable()
export class ResizeNodeHandler extends DragHandlerBase<FResizeNodeStartEventData> {
  protected readonly type = RESIZE_NODE_HANDLER_TYPE;
  protected readonly kind = RESIZE_NODE_HANDLER_KIND;
  protected override data() {
    return new FResizeNodeStartEventData(this._nodeOrGroup.fId());
  }

  private readonly _mediator = inject(FMediator);
  private readonly _cache = inject(FGeometryCache);

  private _baselineRect!: IRect;
  private _constraints!: IResizeConstraint;

  private _lastRect: IRect | null = null;

  private _nodeOrGroup!: FNodeBase;
  private _handleType!: EFResizeHandleType;
  private _nodeConnections: IResizeNodeConnectionHandlers = { source: [], target: [] };
  private _softParentConnections: IResizeNodeConnectionHandlers[] = [];

  public initialize(nodeOrGroup: FNodeBase, handleType: EFResizeHandleType): void {
    this._nodeOrGroup = nodeOrGroup;
    this._handleType = handleType;
  }

  public setNodeConnectionHandlers(handlers: IResizeNodeConnectionHandlers): void {
    this._nodeConnections = handlers;
  }

  public setSoftParentConnectionHandlers(handlers: IResizeNodeConnectionHandlers[]): void {
    this._softParentConnections = handlers;
  }

  public override prepareDragSequence(): void {
    this._baselineRect = this._readBaselineRect();
    this._constraints = this._buildConstraints(this._baselineRect);
    this._lastRect = this._baselineRect;
  }

  public override onPointerMove(delta: IPoint): void {
    const nextRect = this._calcNextRect(delta);
    this._applyConstraints(nextRect);
    this._commitRect(nextRect);
    this._applyConnectionHandlers(this._nodeConnections);

    for (const parentConnections of this._softParentConnections) {
      this._applyConnectionHandlers(parentConnections);
    }

    this._lastRect = nextRect;
  }

  public override onPointerUp(): void {
    const rect = this._lastRect ?? this._fallbackRectFromModel();
    this._nodeOrGroup.sizeChange.emit(rect);

    requestAnimationFrame(() => this._nodeOrGroup.refresh());
  }

  // --------------------------
  // Build
  // --------------------------

  private _readBaselineRect(): IRect {
    return this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(this._nodeOrGroup.hostElement),
    );
  }

  private _buildConstraints(baselineRect: IRect): IResizeConstraint {
    return this._mediator.execute<IResizeConstraint>(
      new CalculateResizeLimitsRequest(this._nodeOrGroup, baselineRect),
    );
  }

  // --------------------------
  // Apply
  // --------------------------

  private _calcNextRect(delta: IPoint): IRect {
    return this._mediator.execute<IRect>(
      new CalculateChangedRectFromDifferenceRequest(
        this._baselineRect,
        delta,
        this._handleType,
        this._constraints.minimumSize,
      ),
    );
  }

  private _applyConstraints(rect: IRect): void {
    this._mediator.execute(
      new ApplyChildResizeConstraintsRequest(rect, this._constraints.childrenBounds),
    );

    this._mediator.execute(new ApplyParentResizeConstraintsRequest(rect, this._constraints.limits));
  }

  private _commitRect(rect: IRect): void {
    this._nodeOrGroup.updatePosition({ x: rect.x, y: rect.y });
    this._nodeOrGroup.updateSize({ width: rect.width, height: rect.height });
    this._cache.setNodeRect(this._nodeOrGroup.fId(), rect);
    this._nodeOrGroup.redraw();
  }

  private _fallbackRectFromModel(): IRect {
    return RectExtensions.initialize(
      this._nodeOrGroup._position.x,
      this._nodeOrGroup._position.y,
      this._nodeOrGroup._size?.width,
      this._nodeOrGroup._size?.height,
    );
  }

  private _applyConnectionHandlers(handlers: IResizeNodeConnectionHandlers): void {
    if (!handlers.source.length && !handlers.target.length) {
      return;
    }

    const currentRectByConnectorId = new Map<string, IRoundedRect>();

    for (const source of handlers.source) {
      const currentRect = this._readConnectorRect(source.connector, currentRectByConnectorId);
      source.handler.setSourceRect(currentRect);
    }

    for (const target of handlers.target) {
      const currentRect = this._readConnectorRect(target.connector, currentRectByConnectorId);
      target.handler.setTargetRect(currentRect);
    }
  }

  private _readConnectorRect(
    connector: FConnectorBase,
    cache: Map<string, IRoundedRect>,
  ): IRoundedRect {
    const cacheKey = `${connector.kind}::${connector.fId()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const rect = this._mediator.execute<IRoundedRect>(
      new GetNormalizedConnectorRectRequest(connector.hostElement, false),
    );
    cache.set(cacheKey, rect);

    return rect;
  }
}
