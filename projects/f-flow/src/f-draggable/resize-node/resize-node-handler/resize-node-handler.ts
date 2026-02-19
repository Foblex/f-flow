import { IPoint, IRect, RectExtensions } from '@foblex/2d';
import { DragHandlerBase } from '../../infrastructure';
import { EFResizeHandleType, FNodeBase } from '../../../f-node';
import { FMediator } from '@foblex/mediator';
import { CalculateResizeLimitsRequest } from '../calculate-resize-limits';
import { ApplyChildResizeConstraintsRequest } from '../apply-child-resize-constraints';
import { CalculateChangedRectFromDifferenceRequest } from '../calculate-changed-rect-from-difference';
import { ApplyParentResizeConstraintsRequest } from '../apply-parent-resize-constraints';
import { GetNormalizedElementRectRequest } from '../../../domain';
import { inject, Injectable } from '@angular/core';
import { IResizeConstraint } from '../constraint';
import { FResizeNodeStartEventData } from '../f-resize-node-start-event-data';
import { RESIZE_NODE_HANDLER_KIND, RESIZE_NODE_HANDLER_TYPE } from '../is-resize-node-handler';

@Injectable()
export class ResizeNodeHandler extends DragHandlerBase<FResizeNodeStartEventData> {
  protected readonly type = RESIZE_NODE_HANDLER_TYPE;
  protected readonly kind = RESIZE_NODE_HANDLER_KIND;
  protected override data() {
    return new FResizeNodeStartEventData(this._nodeOrGroup.fId());
  }

  private readonly _mediator = inject(FMediator);

  private _baselineRect!: IRect;
  private _constraints!: IResizeConstraint;

  private _lastRect: IRect | null = null;

  private _nodeOrGroup!: FNodeBase;
  private _handleType!: EFResizeHandleType;

  public initialize(nodeOrGroup: FNodeBase, handleType: EFResizeHandleType): void {
    this._nodeOrGroup = nodeOrGroup;
    this._handleType = handleType;
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
}
