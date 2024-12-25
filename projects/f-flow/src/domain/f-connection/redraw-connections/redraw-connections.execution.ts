import { ILine } from '@foblex/2d';
import { Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { GetConnectionLineRequest } from '../../get-connection-line';
import { FConnectorBase } from '../../../f-connectors';
import { FConnectionBase } from '../../../f-connection';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetElementRectInFlowRequest } from '../../get-element-rect-in-flow';
import { CreateConnectionMarkersRequest } from '../create-connection-markers';

@Injectable()
@FExecutionRegister(RedrawConnectionsRequest)
export class RedrawConnectionsExecution implements IExecution<RedrawConnectionsRequest, void> {

  constructor(
    private readonly fComponentsStore: FComponentsStore,
    private fMediator: FMediator,
  ) {
  }

  public handle(request: RedrawConnectionsRequest): void {
    this.resetConnectors();

    if (this.fComponentsStore.fTempConnection) {
      this.setMarkers(this.fComponentsStore.fTempConnection);
    }

    if (this.fComponentsStore.fSnapConnection) {
      this.setMarkers(this.fComponentsStore.fSnapConnection);
    }

    this.fComponentsStore.fConnections.forEach((connection) => {
      const output = this.fComponentsStore.fOutputs.find((x) => x.fId === connection.fOutputId);
      const input = this.fComponentsStore.fInputs.find((x) => x.fId === connection.fInputId);
      if (output && input) {
        this.setupConnection(output, input, connection);
      }
    });
  }

  private resetConnectors(): void {
    this.fComponentsStore.fOutputs.forEach((output) => output.setConnected(false, undefined));
    this.fComponentsStore.fInputs.forEach((input) => input.setConnected(false, undefined));
  }

  private setupConnection(output: FConnectorBase, input: FConnectorBase, connection: FConnectionBase): void {
    output.setConnected(true, input);
    input.setConnected(true, output);

    const line = this.getLine(output, input, connection);

    this.setMarkers(connection);

    connection.setLine(line.point1, output.fConnectableSide, line.point2, input.fConnectableSide);

    connection.initialize();
    connection.isSelected() ? connection.select() : null;
  }

  private getLine(output: FConnectorBase, input: FConnectorBase, connection: FConnectionBase): ILine {
    return this.fMediator.send(new GetConnectionLineRequest(
        this.fMediator.send(new GetElementRectInFlowRequest(output.hostElement)),
        this.fMediator.send(new GetElementRectInFlowRequest(input.hostElement)),
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
