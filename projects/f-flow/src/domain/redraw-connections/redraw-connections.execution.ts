import { ILine } from '@foblex/core';
import { Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../f-storage';
import { GetConnectionLineRequest } from '../get-connection-line';
import { FConnectorBase } from '../../f-connectors';
import { FConnectionBase } from '../../f-connection';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../infrastructure';
import { GetElementRectInFlowRequest } from '../get-element-rect-in-flow';
import { CreateConnectionMarkersRequest } from '../create-connection-markers';
import { IConnectorShape, IRoundedRect } from '../intersections';

@Injectable()
@FExecutionRegister(RedrawConnectionsRequest)
export class RedrawConnectionsExecution implements IExecution<RedrawConnectionsRequest, void> {

  constructor(
    private readonly fComponentsStore: FComponentsStore,
    private fMediator: FFlowMediator,
  ) {
  }

  public handle(request: RedrawConnectionsRequest): void {
    this.resetConnectors();

    if (this.fComponentsStore.fTempConnection) {
      this.setMarkers(this.fComponentsStore.fTempConnection);
    }

    this.fComponentsStore.fConnections.forEach((connection) => {
      const output = this.fComponentsStore.fOutputs.find((x) => x.id === connection.fOutputId);
      const input = this.fComponentsStore.fInputs.find((x) => x.id === connection.fInputId);
      if (output && input) {
        this.setupConnection(output, input, connection);
      }
    });
  }

  private resetConnectors(): void {
    this.fComponentsStore.fOutputs.forEach((output) => output.setConnected(false));
    this.fComponentsStore.fInputs.forEach((input) => input.setConnected(false));
  }

  private setupConnection(output: FConnectorBase, input: FConnectorBase, connection: FConnectionBase): void {
    output.setConnected(true);
    input.setConnected(true);

    const line = this.getLine(output, input, connection);

    this.setMarkers(connection);

    connection.setLine(line.point1, output.fConnectableSide, line.point2, input.fConnectableSide);

    connection.initialize();
    connection.isSelected() ? connection.select() : null;
  }

  private getLine(output: FConnectorBase, input: FConnectorBase, connection: FConnectionBase): ILine {
    const outputRect = this.fMediator.send<IConnectorShape>(new GetElementRectInFlowRequest(output.hostElement));
    const inputRect = this.fMediator.send<IConnectorShape>(new GetElementRectInFlowRequest(input.hostElement));
    return this.fMediator.send(new GetConnectionLineRequest(
        outputRect,
        inputRect,
        connection.fBehavior,
        output.fConnectableSide,
        input.fConnectableSide
      )
    );
  }

  private setMarkers(connection: FConnectionBase): void {
    this.fMediator.send(
      new CreateConnectionMarkersRequest(connection)
    );
  }
}
