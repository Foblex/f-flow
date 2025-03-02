import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { CalculateInputConnectionsRequest } from './calculate-input-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';
import { FConnectionBase } from '../../../f-connection';

@Injectable()
@FExecutionRegister(CalculateInputConnectionsRequest)
export class CalculateInputConnectionsExecution implements IExecution<CalculateInputConnectionsRequest, FConnectionBase[]> {

  private readonly _fComponentsStore = inject(FComponentsStore);

  public handle(request: CalculateInputConnectionsRequest): FConnectionBase[] {
    return this._calculateConnections(
      new Set(this._calculateConnectors(request.fNode))
    );
  }

  private _calculateConnectors(fNode: FNodeBase): string[] {
    return this._fComponentsStore.fInputs
      .filter((x) => fNode.isContains(x.hostElement))
      .map((x) => x.fId);
  }

  private _calculateConnections(ids: Set<string>): FConnectionBase[] {
    return this._fComponentsStore.fConnections
      .filter((x) => ids.has(x.fInputId));
  }
}
