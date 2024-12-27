import { ILine, IPoint, RoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../f-connection';
import { FMediator } from '@foblex/mediator';
import {
  GetConnectionLineRequest,
} from '../../domain';
import { ConnectionBaseDragHandler } from './connection-base-drag-handler';
import { INodeMoveRestrictions } from './create-move-nodes-drag-model-from-selection';
import { FComponentsStore } from '../../f-storage';

export class ConnectionDragHandler extends ConnectionBaseDragHandler {

  private sourceRestrictions!: INodeMoveRestrictions;
  private targetRestrictions!: INodeMoveRestrictions;

  constructor(
    fMediator: FMediator,
    fComponentsStore: FComponentsStore,
    connection: FConnectionBase,
  ) {
    super(fMediator, fComponentsStore, connection);
  }

  public setOutputRestrictions(min: IPoint, max: IPoint) {
    this.sourceRestrictions = { min, max };
  }

  public setInputRestrictions(min: IPoint, max: IPoint) {
    this.targetRestrictions = { min, max };
  }

  public override onPointerMove(difference: IPoint): void {
    this.redrawConnection(this.getNewLineValue(difference));
  }

  private getNewLineValue(difference: IPoint): ILine {
    return this.fMediator.send<ILine>(new GetConnectionLineRequest(
      RoundedRect.fromRoundedRect(this.fOutputWithRect.fRect).addPoint(this.getDifference({ ...difference }, this.sourceRestrictions)),
      RoundedRect.fromRoundedRect(this.fInputWithRect.fRect).addPoint(this.getDifference({ ...difference }, this.targetRestrictions)),
      this.connection.fBehavior,
      this.fOutputWithRect.fConnector.fConnectableSide,
      this.fInputWithRect.fConnector.fConnectableSide
    ));
  }
}
