import { ILine, IMinMaxPoint, IPoint, RoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../f-connection';
import { FMediator } from '@foblex/mediator';
import {
  CalculateConnectionLineByBehaviorRequest,
} from '../../domain';
import { ConnectionBaseDragHandler } from './connection-base-drag-handler';
import { FComponentsStore } from '../../f-storage';

export class ConnectionDragHandler extends ConnectionBaseDragHandler {

  private sourceRestrictions!: IMinMaxPoint;
  private targetRestrictions!: IMinMaxPoint;

  constructor(
    fMediator: FMediator,
    fComponentsStore: FComponentsStore,
    connection: FConnectionBase,
  ) {
    super(fMediator, fComponentsStore, connection);
  }

  public setOutputRestrictions(restrictions: IMinMaxPoint) {
    this.sourceRestrictions = restrictions;
  }

  public setInputRestrictions(restrictions: IMinMaxPoint) {
    this.targetRestrictions = restrictions;
  }

  public override onPointerMove(difference: IPoint): void {
    this.redrawConnection(this.getNewLineValue(difference));
  }

  private getNewLineValue(difference: IPoint): ILine {
    return this.fMediator.execute<ILine>(new CalculateConnectionLineByBehaviorRequest(
      RoundedRect.fromRoundedRect(this.fOutputWithRect.fRect).addPoint(this.getRestrictedDifference({ ...difference }, this.sourceRestrictions)),
      RoundedRect.fromRoundedRect(this.fInputWithRect.fRect).addPoint(this.getRestrictedDifference({ ...difference }, this.targetRestrictions)),
      this.connection.fBehavior,
      this.fOutputWithRect.fConnector.fConnectableSide,
      this.fInputWithRect.fConnector.fConnectableSide
    ));
  }
}
