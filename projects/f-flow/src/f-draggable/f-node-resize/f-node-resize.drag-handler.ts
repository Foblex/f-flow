import { IPoint, IRect, ISize, RectExtensions } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { EFResizeHandleType, FNodeBase } from '../../f-node';
import { FMediator } from '@foblex/mediator';
import { GetNodeResizeRestrictionsRequest, INodeResizeRestrictions } from './get-node-resize-restrictions';
import { ApplyChildResizeRestrictionsRequest } from './apply-child-resize-restrictions';
import { CalculateChangedSizeRequest } from './calculate-changed-size';
import { CalculateChangedPositionRequest } from './calculate-changed-position';
import { ApplyParentResizeRestrictionsRequest } from './apply-parent-resize-restrictions';
import { GetNormalizedElementRectRequest } from '../../domain';
import { fInject } from '../f-injector';

export class FNodeResizeDragHandler implements IFDragHandler {

  public readonly fEventType = 'node-resize';
  public readonly fData: any;

  private readonly _fMediator = fInject(FMediator);

  private _originalRect!: IRect;
  private _resizeRestrictions!: INodeResizeRestrictions;

  constructor(
    private _fNode: FNodeBase,
    private _fResizeHandleType: EFResizeHandleType,
  ) {
    this.fData = {
      fNodeId: _fNode.fId,
    };
  }

  public prepareDragSequence(): void {
    this._originalRect = this._getOriginalNodeRect();
    this._resizeRestrictions = this._getNodeResizeRestrictions();
  }

  private _getOriginalNodeRect(): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(this._fNode.hostElement, false));
  }

  private _getNodeResizeRestrictions(): INodeResizeRestrictions {
    return this._fMediator.execute<INodeResizeRestrictions>(
      new GetNodeResizeRestrictionsRequest(this._fNode, this._originalRect)
    );
  }

  public onPointerMove(difference: IPoint): void {
    this._applyResizeChanges(this._calculateChangedRect(difference));
  }

  private _calculateChangedRect(difference: IPoint): IRect {
    const changedSize = this._calculateSize(difference, this._resizeRestrictions.minimumSize);
    return this._calculatePosition(difference, changedSize, this._resizeRestrictions.minimumSize);
  }

  private _calculateSize(difference: IPoint, minimumSize: ISize): IRect {
    return this._fMediator.execute<IRect>(
      new CalculateChangedSizeRequest(this._originalRect, difference, minimumSize, this._fResizeHandleType)
    );
  }

  private _calculatePosition(difference: IPoint, changedSize: IRect, minimumSize: ISize): IRect {
    return this._fMediator.execute<IRect>(
      new CalculateChangedPositionRequest(this._originalRect, changedSize, difference, minimumSize, this._fResizeHandleType)
    );
  }

  private _applyResizeChanges(changedRect: IRect): void {
    if(this._resizeRestrictions.childrenBounds) {
      this._applyChildRestrictions(changedRect, this._resizeRestrictions.childrenBounds);
    }

    this._applyParentRestrictions(changedRect, this._resizeRestrictions.parentBounds);
    this._updateNodeRendering(changedRect);
  }

  private _updateNodeRendering(changedRect: IRect): void {
    this._fNode.updatePosition(changedRect);
    this._fNode.updateSize(changedRect);
    this._fNode.redraw();
  }

  private _applyChildRestrictions(changedRect: IRect, restrictions: IRect): void {
    this._fMediator.execute(
      new ApplyChildResizeRestrictionsRequest(changedRect, restrictions)
    );
  }

  private _applyParentRestrictions(changedRect: IRect, restrictions: IRect): void {
    this._fMediator.execute(
      new ApplyParentResizeRestrictionsRequest(changedRect, restrictions)
    );
  }

  public onPointerUp(): void {
    this._fNode.sizeChange.emit(this._getNewRect());
  }

  private _getNewRect(): IRect {
    return RectExtensions.initialize(
      this._fNode.position.x, this._fNode.position.y, this._fNode.size?.width, this._fNode.size?.height
    );
  }
}
