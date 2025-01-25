import { IDraggableItem } from '../i-draggable-item';
import { FConnectionBase } from '../../f-connection';
import { FConnectorBase } from '../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { Directive } from '@angular/core';
import { ILine, IMinMaxPoint, IPoint } from '@foblex/2d';
import { FComponentsStore } from '../../f-storage';
import { GetConnectorAndRectRequest, IConnectorAndRect } from '../../domain';

@Directive()
export abstract class ConnectionBaseDragHandler implements IDraggableItem {

  protected fOutputWithRect!: IConnectorAndRect;
  protected fInputWithRect!: IConnectorAndRect;

  protected constructor(
    protected fMediator: FMediator,
    protected fComponentsStore: FComponentsStore,
    public connection: FConnectionBase,
  ) {
  }

  public prepareDragSequence(): void {
    this.fOutputWithRect = this.fMediator.send<IConnectorAndRect>(new GetConnectorAndRectRequest(this.getOutput()));
    this.fInputWithRect = this.fMediator.send<IConnectorAndRect>(new GetConnectorAndRectRequest(this.getInput()));
  }

  private getOutput(): FConnectorBase {
    const result = this.fComponentsStore.fOutputs.find((x) => x.fId === this.connection.fOutputId)!;
    if (!result) {
      throw new Error(this.connectorNotFoundPrefix(`fOutput with id ${ this.connection.fOutputId } not found`));
    }
    return result;
  }

  private getInput(): FConnectorBase {
    const result = this.fComponentsStore.fInputs.find((x) => x.fId === this.connection.fInputId)!;
    if (!result) {
      throw new Error(this.connectorNotFoundPrefix(`fInput with id ${ this.connection.fInputId } not found`));
    }
    return result;
  }

  private connectorNotFoundPrefix(message: string): string {
    return `ConnectionDragHandler Error: Connection From (fOutput)${ this.connection.fOutputId } To (fInput)${ this.connection.fInputId }. ${ message }. Please ensure that all f-connections are associated with existing connectors`;
  }

  public abstract onPointerMove(difference: IPoint): void;

  protected getRestrictedDifference(difference: IPoint, restrictions: IMinMaxPoint): IPoint {
    return {
      x: Math.min(Math.max(difference.x, restrictions.min.x), restrictions.max.x),
      y: Math.min(Math.max(difference.y, restrictions.min.y), restrictions.max.y)
    }
  }

  protected redrawConnection(line: ILine): void {
    this.connection.setLine(line.point1, this.fOutputWithRect.fConnector.fConnectableSide, line.point2, this.fInputWithRect.fConnector.fConnectableSide);
    this.connection.redraw();
  }
}
