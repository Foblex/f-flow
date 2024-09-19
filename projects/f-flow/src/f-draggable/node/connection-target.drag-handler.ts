import { ILine, IPoint, RoundedRect } from '@foblex/2d';
import {
  GetConnectionLineRequest,
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
    public minDistance: IPoint,
    public maxDistance: IPoint
  ) {
    super(fMediator, fComponentsStore, connection);
  }

  public override move(difference: IPoint): void {
    this.redrawConnection(this.getNewLineValue(difference));
  }

  private getNewLineValue(difference: IPoint): ILine {
    return this.fMediator.send<ILine>(new GetConnectionLineRequest(
      RoundedRect.fromRect(this.fOutputWithRect.fRect),
      RoundedRect.fromRect(this.fInputWithRect.fRect).addPoint(this.getDifference({ ...difference }, { min: this.minDistance, max: this.maxDistance })),
      this.connection.fBehavior,
      this.fOutputWithRect.fConnector.fConnectableSide,
      this.fInputWithRect.fConnector.fConnectableSide
    ));
  }
}
