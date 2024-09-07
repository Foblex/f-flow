import { ILine, IPoint } from '@foblex/core';
import { FConnectionBase } from '../../f-connection';
import { FFlowMediator } from '../../infrastructure';
import {
  GetConnectionLineRequest,
} from '../../domain';
import { ConnectionBaseDragHandler } from './connection-base-drag-handler';
import { INodeMoveRestrictions } from './create-move-nodes-drag-model-from-selection';

export class ConnectionDragHandler extends ConnectionBaseDragHandler {

  private sourceRestrictions!: INodeMoveRestrictions;
  private targetRestrictions!: INodeMoveRestrictions;

  constructor(
    fMediator: FFlowMediator,
    connection: FConnectionBase
  ) {
    super(fMediator, connection);
  }

  public setOutputRestrictions(min: IPoint, max: IPoint) {
    this.sourceRestrictions = { min, max };
  }

  public setInputRestrictions(min: IPoint, max: IPoint) {
    this.targetRestrictions = { min, max };
  }

  public override move(difference: IPoint): void {
    this.redrawConnection(this.getNewLineValue(difference));
  }

  private getNewLineValue(difference: IPoint): ILine {
    return this.fMediator.send<ILine>(new GetConnectionLineRequest(
      this.fromConnectorRect.addPoint(this.getDifference({ ...difference }, this.sourceRestrictions)),
      this.toConnectorRect.addPoint(this.getDifference({ ...difference }, this.targetRestrictions)),
      this.connection.fBehavior,
      this.fromConnectorSide,
      this.toConnectorSide
    ));
  }
}
