import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { CalculateInputConnectionsRequest } from './calculate-input-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { FConnectionBase } from '../../../f-connection';

/**
 * Execution that calculates input connections for a given FNode.
 */
@Injectable()
@FExecutionRegister(CalculateInputConnectionsRequest)
export class CalculateInputConnections
  implements IExecution<CalculateInputConnectionsRequest, FConnectionBase[]>
{
  private readonly _store = inject(FComponentsStore);

  public handle({ nodeOrGroup }: CalculateInputConnectionsRequest): FConnectionBase[] {
    const ids = this._collectInputIds(nodeOrGroup);

    return this._collectConnections(ids);
  }

  private _collectInputIds(nodeOrGroup: FNodeBase): Set<string> {
    const ids = new Set<string>();
    for (const connector of this._store.fInputs) {
      if (nodeOrGroup.isContains(connector.hostElement)) {
        ids.add(connector.fId());
      }
    }

    return ids;
  }

  private _collectConnections(ids: Set<string>): FConnectionBase[] {
    const result: FConnectionBase[] = [];
    for (const conn of this._store.fConnections) {
      if (ids.has(conn.fInputId())) {
        result.push(conn);
      }
    }

    return result;
  }
}
