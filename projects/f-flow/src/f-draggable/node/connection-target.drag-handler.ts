import { ILine, IMinMaxPoint, IPoint, RoundedRect } from '@foblex/2d';
import {
  CalculateConnectionLineByBehaviorRequest,
} from '../../domain';
import { FConnectionBase } from '../../f-connection';
import { FMediator } from '@foblex/mediator';
import { ConnectionBaseDragHandler } from './connection-base-drag-handler';
import { FComponentsStore } from '../../f-storage';

export class ConnectionTargetDragHandler extends ConnectionBaseDragHandler {

  constructor(
    fMediator: FMediator,
    fComponentsStore: FComponentsStore,
    connection: FConnectionBase,
    public restrictions: IMinMaxPoint,
  ) {
    super(fMediator, fComponentsStore, connection);
  }

  public override onPointerMove(difference: IPoint): void {
    this.redrawConnection(this.getNewLineValue(difference));
  }

  private getNewLineValue(difference: IPoint): ILine {
    return this.fMediator.execute<ILine>(new CalculateConnectionLineByBehaviorRequest(
      this.fOutputWithRect.fRect,
      RoundedRect.fromRoundedRect(this.fInputWithRect.fRect).addPoint(this.getRestrictedDifference({ ...difference }, this.restrictions)),
      this.connection.fBehavior,
      this.fOutputWithRect.fConnector.fConnectableSide,
      this.fInputWithRect.fConnector.fConnectableSide
    ));
  }
}
