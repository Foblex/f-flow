import { ILine, IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { CalculateConnectionLineByBehaviorRequest } from '../calculate-connection-line-by-behavior';
import { FConnectorBase } from '../../../f-connectors';
import { FConnectionBase } from '../../../f-connection';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateConnectionMarkersRequest } from '../create-connection-markers';
import { GetNormalizedConnectorRectRequest } from '../../get-normalized-connector-rect';

/**
 * Execution that redraws connections in the FComponentsStore.
 * It resets connectors, sets markers for temporary and snap connections,
 * and sets up connections based on the stored outputs and inputs.
 */
@Injectable()
@FExecutionRegister(RedrawConnectionsRequest)
export class RedrawConnectionsExecution implements IExecution<RedrawConnectionsRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  public handle(_request: RedrawConnectionsRequest): void {
    this._resetConnectors();

    if (this._store.fTempConnection) {
      this._setMarkers(this._store.fTempConnection);
    }

    if (this._store.fSnapConnection) {
      this._setMarkers(this._store.fSnapConnection);
    }

    this._store.fConnections.forEach((x) => {
      this._setupConnection(this._getOutput(x.fOutputId()), this._getInput(x.fInputId()), x);
    });
  }

  private _getOutput(id: string): FConnectorBase {
    const result = this._store.fOutputs.find((x) => x.fId() === id);
    if (!result) {
      throw new Error(`Output with id ${id} not found`);
    }

    return result;
  }

  private _getInput(id: string): FConnectorBase {
    const result = this._store.fInputs.find((x) => x.fId() === id);
    if (!result) {
      throw new Error(`Input with id ${id} not found`);
    }

    return result;
  }

  private _resetConnectors(): void {
    this._store.fOutputs.forEach((x) => x.resetConnected());
    this._store.fInputs.forEach((x) => x.resetConnected());
  }

  private _setupConnection(
    fOutput: FConnectorBase,
    fInput: FConnectorBase,
    fConnection: FConnectionBase,
  ): void {
    fOutput.setConnected(fInput);
    fInput.setConnected(fOutput);

    const line = this._getLine(fOutput, fInput, fConnection);

    this._setMarkers(fConnection);

    fConnection.setLine(line, fOutput.fConnectableSide, fInput.fConnectableSide);

    fConnection.initialize();
    fConnection.isSelected() ? fConnection.markAsSelected() : null;
  }

  private _getLine(
    output: FConnectorBase,
    input: FConnectorBase,
    connection: FConnectionBase,
  ): ILine {
    return this._mediator.execute(
      new CalculateConnectionLineByBehaviorRequest(
        this._mediator.execute<IRoundedRect>(
          new GetNormalizedConnectorRectRequest(output.hostElement),
        ),
        this._mediator.execute<IRoundedRect>(
          new GetNormalizedConnectorRectRequest(input.hostElement),
        ),
        connection.fBehavior,
        output.fConnectableSide,
        input.fConnectableSide,
      ),
    );
  }

  private _setMarkers(connection: FConnectionBase): void {
    this._mediator.execute(new CreateConnectionMarkersRequest(connection));
  }
}
