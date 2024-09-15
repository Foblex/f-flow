import { ILine, IPoint } from '@foblex/2d';
import {
  GetConnectionLineRequest,
} from '../../domain';
import { FConnectionBase } from '../../f-connection';
import { FMediator } from '@foblex/mediator';
import { ConnectionBaseDragHandler } from './connection-base-drag-handler';

export class ConnectionTargetDragHandler extends ConnectionBaseDragHandler {

  constructor(
    fMediator: FMediator,
    connection: FConnectionBase,
    public minDistance: IPoint,
    public maxDistance: IPoint
  ) {
    super(fMediator, connection);
  }

  public override move(difference: IPoint): void {
    this.redrawConnection(this.getNewLineValue(difference));
  }

  private getNewLineValue(difference: IPoint): ILine {
    return this.fMediator.send<ILine>(new GetConnectionLineRequest(
      this.fromConnectorRect,
      this.toConnectorRect.addPoint(this.getDifference({ ...difference }, { min: this.minDistance, max: this.maxDistance })),
      this.connection.fBehavior,
      this.fromConnectorSide,
      this.toConnectorSide
    ));
  }
}
