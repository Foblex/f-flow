import { ILine, IPoint } from '@foblex/core';
import { IDraggableItem } from '../i-draggable-item';
import {
  GetInputRectInFlowRequest,
  GetInputRectInFlowResponse,
  GetOutputRectInFlowRequest,
  GetOutputRectInFlowResponse, RoundedRect
} from '../../domain';
import { FConnectionBase } from '../../f-connection';
import { EFConnectableSide } from '../../f-connectors';
import { FFlowMediator } from '../../infrastructure';
import { Directive } from '@angular/core';
import { INodeMoveRestrictions } from './create-move-nodes-drag-model-from-selection';

@Directive()
export abstract class ConnectionBaseDragHandler implements IDraggableItem {

  protected fromConnectorRect: RoundedRect = new RoundedRect();
  protected fromConnectorSide: EFConnectableSide = EFConnectableSide.BOTTOM;

  protected toConnectorRect: RoundedRect = new RoundedRect();
  protected toConnectorSide: EFConnectableSide = EFConnectableSide.TOP;

  protected constructor(
    protected fMediator: FFlowMediator,
    public connection: FConnectionBase,
  ) {
  }

  public initialize(): void {
    const fromConnector = this.fMediator.send<GetOutputRectInFlowResponse>(
      new GetOutputRectInFlowRequest(this.connection.fOutputId)
    );
    this.fromConnectorRect = RoundedRect.fromRoundedRect(fromConnector.rect);
    this.fromConnectorSide = fromConnector.fConnectableSide;

    const toConnector = this.fMediator.send<GetInputRectInFlowResponse>(
      new GetInputRectInFlowRequest(this.connection.fInputId)
    );
    this.toConnectorRect = RoundedRect.fromRoundedRect(toConnector.rect);
    this.toConnectorSide = toConnector.fConnectableSide;
  }

  public abstract move(difference: IPoint): void;

  protected getDifference(difference: IPoint, restrictions: INodeMoveRestrictions): IPoint {
    return {
      x: Math.min(Math.max(difference.x, restrictions.min.x), restrictions.max.x),
      y: Math.min(Math.max(difference.y, restrictions.min.y), restrictions.max.y)
    }
  }

  protected redrawConnection(line: ILine): void {
    this.connection.setLine(line.point1, this.fromConnectorSide, line.point2, this.toConnectorSide);
    this.connection.redraw();
  }
}
