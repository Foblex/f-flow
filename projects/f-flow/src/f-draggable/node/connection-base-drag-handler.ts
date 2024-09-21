import { IDraggableItem } from '../i-draggable-item';
import { FConnectionBase } from '../../f-connection';
import { FConnectorBase } from '../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { Directive } from '@angular/core';
import { INodeMoveRestrictions } from './create-move-nodes-drag-model-from-selection';
import { ILine, IPoint } from '@foblex/2d';
import { FComponentsStore } from '../../f-storage';
import { GetConnectorWithRectRequest, IConnectorWithRect } from '../../domain';

@Directive()
export abstract class ConnectionBaseDragHandler implements IDraggableItem {

  protected fOutputWithRect!: IConnectorWithRect;
  protected fInputWithRect!: IConnectorWithRect;

  protected constructor(
    protected fMediator: FMediator,
    protected fComponentsStore: FComponentsStore,
    public connection: FConnectionBase,
  ) {
  }

  public initialize(): void {
    this.fOutputWithRect = this.fMediator.send<IConnectorWithRect>(new GetConnectorWithRectRequest(this.getOutput()));
    this.fInputWithRect = this.fMediator.send<IConnectorWithRect>(new GetConnectorWithRectRequest(this.getInput()));
  }

  private getOutput(): FConnectorBase {
    return this.fComponentsStore.fOutputs.find((x) => x.id === this.connection.fOutputId)!;
  }

  private getInput(): FConnectorBase {
    return this.fComponentsStore.fInputs.find((x) => x.id === this.connection.fInputId)!
  }

  public abstract move(difference: IPoint): void;

  protected getDifference(difference: IPoint, restrictions: INodeMoveRestrictions): IPoint {
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
