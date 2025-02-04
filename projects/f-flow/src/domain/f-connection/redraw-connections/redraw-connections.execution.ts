import { ILine } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
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

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RedrawConnectionsRequest): void {
    this._resetConnectors();

    if (this._fComponentsStore.fTempConnection) {
      this._setMarkers(this._fComponentsStore.fTempConnection);
    }

    if (this._fComponentsStore.fSnapConnection) {
      this._setMarkers(this._fComponentsStore.fSnapConnection);
    }

    this._fComponentsStore.fConnections.forEach((x) => {
      this._setupConnection(this._getOutput(x.fOutputId), this._getInput(x.fInputId), x);
    });
  }

  private _getOutput(id: string): FConnectorBase {
    const result = this._fComponentsStore.fOutputs.find((x) => x.fId === id)!;
    if(!result) {
      throw new Error(`Output with id ${id} not found`);
    }
    return result;
  }

  private _getInput(id: string): FConnectorBase {
    const result = this._fComponentsStore.fInputs.find((x) => x.fId === id)!;
    if(!result) {
      throw new Error(`Input with id ${id} not found`);
    }
    return result;
  }

  private _resetConnectors(): void {
    this._fComponentsStore.fOutputs.forEach((x) => x.resetConnected());
    this._fComponentsStore.fInputs.forEach((x) => x.resetConnected());
  }

  private _setupConnection(fOutput: FConnectorBase, fInput: FConnectorBase, fConnection: FConnectionBase): void {
    fOutput.setConnected(fInput);
    fInput.setConnected(fOutput);

    const line = this._getLine(fOutput, fInput, fConnection);

    this._setMarkers(fConnection);

    fConnection.setLine(line.point1, fOutput.fConnectableSide, line.point2, fInput.fConnectableSide);

    fConnection.initialize();
    fConnection.isSelected() ? fConnection.markAsSelected() : null;
  }

  private _getLine(output: FConnectorBase, input: FConnectorBase, connection: FConnectionBase): ILine {
    return this._fMediator.execute(new CalculateConnectionLineByBehaviorRequest(
        this._fMediator.execute(new GetNormalizedElementRectRequest(output.hostElement, true)),
        this._fMediator.execute(new GetNormalizedElementRectRequest(input.hostElement, true)),
        connection.fBehavior,
        output.fConnectableSide,
        input.fConnectableSide
      )
    );
  }

  private _setMarkers(connection: FConnectionBase): void {
    this._fMediator.execute(
      new CreateConnectionMarkersRequest(connection)
    );
  }
}
