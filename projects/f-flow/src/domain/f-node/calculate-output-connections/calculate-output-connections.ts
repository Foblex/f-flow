import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { CalculateOutputConnectionsRequest } from './calculate-output-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { FConnectionBase } from '../../../f-connection-v2';

/**
 * Execution that calculates output connections for a given FNode.
 */
@Injectable()
@FExecutionRegister(CalculateOutputConnectionsRequest)
export class CalculateOutputConnections
  implements IExecution<CalculateOutputConnectionsRequest, FConnectionBase[]>
{
  private readonly _store = inject(FComponentsStore);

  public handle({ nodeOrGroup }: CalculateOutputConnectionsRequest): FConnectionBase[] {
    const ids = this._collectOutputIds(nodeOrGroup);

    return this._collectConnections(ids);
  }

  private _collectOutputIds(nodeOrGroup: FNodeBase): Set<string> {
    const ids = new Set<string>();
    const connectors = this._store.outputs.getAll();
    for (const connector of connectors) {
      if (nodeOrGroup.isContains(connector.hostElement)) {
        ids.add(connector.fId());
      }
    }

    return ids;
  }

  private _collectConnections(ids: Set<string>): FConnectionBase[] {
    const result: FConnectionBase[] = [];
    for (const conn of this._store.connections.getAll<FConnectionBase>()) {
      if (ids.has(conn.fOutputId())) {
        result.push(conn);
      }
    }

    return result;
  }
}
