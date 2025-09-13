import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { CalculateOutputConnectionsRequest } from './calculate-output-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { FConnectionBase } from '../../../f-connection';

/**
 * Execution that calculates output connections for a given FNode.
 */
@Injectable()
@FExecutionRegister(CalculateOutputConnectionsRequest)
export class CalculateOutputConnections
  implements IExecution<CalculateOutputConnectionsRequest, FConnectionBase[]>
{
  private readonly _store = inject(FComponentsStore);

  public handle(request: CalculateOutputConnectionsRequest): FConnectionBase[] {
    return this._calculateConnections(new Set(this._calculateConnectors(request.fNode)));
  }

  private _calculateConnectors(fNode: FNodeBase): string[] {
    return this._store.fOutputs.filter((x) => fNode.isContains(x.hostElement)).map((x) => x.fId());
  }

  private _calculateConnections(ids: Set<string>): FConnectionBase[] {
    return this._store.fConnections.filter((x) => ids.has(x.fOutputId()));
  }
}
