import { IPoint, IRect, RectExtensions } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { EFResizeHandleType, FNodeBase } from '../../f-node';
import { FMediator } from '@foblex/mediator';
import { CalculateResizeLimitsRequest } from './calculate-resize-limits';
import { ApplyChildResizeConstraintsRequest } from './apply-child-resize-constraints';
import { CalculateChangedRectFromDifferenceRequest } from './calculate-changed-rect-from-difference';
import { ApplyParentResizeConstraintsRequest } from './apply-parent-resize-constraints';
import { GetNormalizedElementRectRequest } from '../../domain';
import { Injector } from '@angular/core';
import { IResizeConstraint } from "./constraint";

export class NodeResizeDragHandler implements IFDragHandler {

  public readonly fEventType = 'node-resize';
  public readonly fData: any;

  private readonly _mediator: FMediator;

  private _originalRect!: IRect;
  private _constraints!: IResizeConstraint;

  constructor(
    injector: Injector,
    private _nodeOrGroup: FNodeBase,
    private _handleType: EFResizeHandleType,
  ) {
    this.fData = {
      fNodeId: _nodeOrGroup.fId(),
    };
    this._mediator = injector.get(FMediator);
  }

  public prepareDragSequence(): void {
    this._originalRect = this._getOriginalNodeRect();
    this._constraints = this._calculateResizeLimits();
  }

  private _getOriginalNodeRect(): IRect {
    return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(this._nodeOrGroup.hostElement));
  }

  private _calculateResizeLimits(): IResizeConstraint {
    return this._mediator.execute<IResizeConstraint>(
      new CalculateResizeLimitsRequest(this._nodeOrGroup, this._originalRect),
    );
  }

  public onPointerMove(difference: IPoint): void {
    this._applyResizeChanges(this._newRect(difference));
  }

  private _newRect(difference: IPoint): IRect {
    return this._mediator.execute<IRect>(
      new CalculateChangedRectFromDifferenceRequest(this._originalRect, difference, this._handleType, this._constraints.minimumSize),
    );
  }

  private _applyResizeChanges(changedRect: IRect): void {
    this._applyChildConstraints(changedRect);
    this._applyParentConstraints(changedRect);
    this._redraw(changedRect);
  }

  private _redraw(changedRect: IRect): void {
    this._nodeOrGroup.updatePosition(changedRect);
    this._nodeOrGroup.updateSize(changedRect);
    this._nodeOrGroup.redraw();
  }

  private _applyChildConstraints(changedRect: IRect): void {
    this._mediator.execute(
      new ApplyChildResizeConstraintsRequest(changedRect, this._constraints.childrenBounds),
    );
  }

  private _applyParentConstraints(changedRect: IRect): void {
    this._mediator.execute(
      new ApplyParentResizeConstraintsRequest(changedRect, this._constraints.limits),
    );
  }

  public onPointerUp(): void {
    this._nodeOrGroup.sizeChange.emit(this._getNewRect());
    requestAnimationFrame(() => this._nodeOrGroup.refresh());
  }

  private _getNewRect(): IRect {
    return RectExtensions.initialize(
      this._nodeOrGroup._position.x, this._nodeOrGroup._position.y,
      this._nodeOrGroup._size?.width, this._nodeOrGroup._size?.height,
    );
  }
}
