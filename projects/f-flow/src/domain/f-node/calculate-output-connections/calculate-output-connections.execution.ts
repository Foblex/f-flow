import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { CalculateOutputConnectionsRequest } from './calculate-output-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { FConnectionBase } from '../../../f-connection';

@Injectable()
@FExecutionRegister(CalculateOutputConnectionsRequest)
export class CalculateOutputConnectionsExecution implements IExecution<CalculateOutputConnectionsRequest, FConnectionBase[]> {

  private readonly _fComponentsStore = inject(FComponentsStore);

  public handle(request: CalculateOutputConnectionsRequest): FConnectionBase[] {
    return this._calculateConnections(
      new Set(this._calculateConnectors(request.fNode))
    );
  }

  private _calculateConnectors(fNode: FNodeBase): string[] {
    return this._fComponentsStore.fOutputs
      .filter((x) => fNode.isContains(x.hostElement))
      .map((x) => x.fId);
  }

  private _calculateConnections(ids: Set<string>): FConnectionBase[] {
    return this._fComponentsStore.fConnections
      .filter((x) => ids.has(x.fOutputId));
  }
}
