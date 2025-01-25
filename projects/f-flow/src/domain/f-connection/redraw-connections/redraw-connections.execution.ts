import { ILine } from '@foblex/2d';
import { Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { CalculateConnectionLineByBehaviorRequest } from '../calculate-connection-line-by-behavior';
import { FConnectorBase } from '../../../f-connectors';
import { FConnectionBase } from '../../../f-connection';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';
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
    this._resetConnectors();

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
        this._setupConnection(output, input, connection);
      }
    });
  }

  private _resetConnectors(): void {
    this.fComponentsStore.fOutputs.forEach((x) => x.resetConnected());
    this.fComponentsStore.fInputs.forEach((x) => x.resetConnected());
  }

  private _setupConnection(output: FConnectorBase, input: FConnectorBase, connection: FConnectionBase): void {
    output.setConnected(input);
    input.setConnected(output);

    const line = this.getLine(output, input, connection);

    this.setMarkers(connection);

    connection.setLine(line.point1, output.fConnectableSide, line.point2, input.fConnectableSide);

    connection.initialize();
    connection.isSelected() ? connection.select() : null;
  }

  private getLine(output: FConnectorBase, input: FConnectorBase, connection: FConnectionBase): ILine {
    return this.fMediator.execute(new CalculateConnectionLineByBehaviorRequest(
        this.fMediator.execute(new GetNormalizedElementRectRequest(output.hostElement, true)),
        this.fMediator.execute(new GetNormalizedElementRectRequest(input.hostElement, true)),
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
