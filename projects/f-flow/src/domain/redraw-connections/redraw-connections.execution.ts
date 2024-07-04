import { IHandler, IRect, IVector } from '@foblex/core';
import { Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../f-storage';
import { GetConnectionVectorRequest } from '../get-connection-vector';
import { FConnectorBase } from '../../f-connectors';
import { FConnectionBase } from '../../f-connection';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../infrastructure';
import { GetElementRectInFlowRequest } from '../get-element-rect-in-flow';
import { CreateConnectionMarkersRequest } from '../create-connection-markers';

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

    const vector = this.getVector(output, input, connection);

    this.setMarkers(connection);

    connection.setVector(vector.point1, output.fConnectableSide, vector.point2, input.fConnectableSide);

    connection.initialize();
    connection.isSelected() ? connection.select() : null;
  }

  private getVector(output: FConnectorBase, input: FConnectorBase, connection: FConnectionBase): IVector {
    const outputRect = this.fMediator.send<IRect>(new GetElementRectInFlowRequest(output.hostElement));
    const inputRect = this.fMediator.send<IRect>(new GetElementRectInFlowRequest(input.hostElement));
    return this.fMediator.send(new GetConnectionVectorRequest(
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
