import { IPoint, IRect, ISize, RectExtensions } from '@foblex/2d';
import { IDraggableItem } from '../i-draggable-item';
import { EFResizeHandleType, FNodeBase } from '../../f-node';
import { FMediator } from '@foblex/mediator';
import { GetNodeResizeRestrictionsRequest, INodeResizeRestrictions } from './get-node-resize-restrictions';
import { ApplyChildResizeRestrictionsRequest } from './apply-child-resize-restrictions';
import { CalculateChangedSizeRequest } from './calculate-changed-size';
import { CalculateChangedPositionRequest } from './calculate-changed-position';
import { ApplyParentResizeRestrictionsRequest } from './apply-parent-resize-restrictions';
import { GetNormalizedElementRectRequest } from '../../domain';

export class NodeResizeDragHandler implements IDraggableItem {

  private originalRect!: IRect;

  private restrictions!: INodeResizeRestrictions;

  private childRestrictions: (rect: IRect, restrictionsRect: IRect) => void = () => {
  };

  constructor(
    private fMediator: FMediator,
    public fNode: FNodeBase,
    public fResizeHandleType: EFResizeHandleType,
  ) {
  }

  public prepareDragSequence(): void {
    this.originalRect = this.fMediator.send<IRect>(new GetNormalizedElementRectRequest(this.fNode.hostElement, false));

    this.restrictions = this.fMediator.send<INodeResizeRestrictions>(new GetNodeResizeRestrictionsRequest(this.fNode, this.originalRect));
    if (this.restrictions.childRect) {
      this.childRestrictions = (rect: IRect, restrictionsRect: IRect) => {
        this.applyChildRestrictions(rect, restrictionsRect);
      };
    }
  }

  public onPointerMove(difference: IPoint): void {
    const changedRect = this.changePosition(difference, this.changeSize(difference, this.restrictions.minSize));

    this.childRestrictions(changedRect, this.restrictions.childRect!);
    this.applyParentRestrictions(changedRect, this.restrictions.parentRect);

    this.fNode.updatePosition(changedRect);
    this.fNode.updateSize(changedRect);
    this.fNode.redraw();
  }

  private changeSize(difference: IPoint, minSize: ISize): IRect {
    return this.fMediator.send<IRect>(
      new CalculateChangedSizeRequest(this.originalRect, difference, this.fResizeHandleType)
    );
  }

  private changePosition(difference: IPoint, changedRect: IRect): IRect {
    return this.fMediator.send<IRect>(
      new CalculateChangedPositionRequest(this.originalRect, changedRect, difference, this.fResizeHandleType)
    );
  }

  private applyChildRestrictions(rect: IRect, restrictionsRect: IRect): void {
    this.fMediator.send(
      new ApplyChildResizeRestrictionsRequest(rect, restrictionsRect)
    );
  }

  private applyParentRestrictions(rect: IRect, restrictionsRect: IRect): void {
    this.fMediator.send(
      new ApplyParentResizeRestrictionsRequest(rect, restrictionsRect)
    );
  }

  public onPointerUp(): void {
    this.fNode.sizeChange.emit(
      RectExtensions.initialize(
        this.fNode.position.x, this.fNode.position.y, this.fNode.size?.width, this.fNode.size?.height
      )
    );
  }
}
