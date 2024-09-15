import { Injectable } from '@angular/core';
import { ShowConnectionsAfterCalculationsRequest } from './show-connections-after-calculations-request';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(ShowConnectionsAfterCalculationsRequest)
export class ShowConnectionsAfterCalculationsExecution implements IExecution<ShowConnectionsAfterCalculationsRequest, void> {

  constructor(
    private readonly fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: ShowConnectionsAfterCalculationsRequest): void {
    this.fComponentsStore.fConnections.forEach((connection) => {
      connection.hostElement.style.display = 'unset';
    });
  }
}
