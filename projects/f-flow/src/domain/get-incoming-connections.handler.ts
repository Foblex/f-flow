import { IHandler } from '@foblex/core';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../f-storage';
import { FConnectionBase } from '../f-connection';
import { FConnectorBase } from '../f-connectors';

@Injectable()
export class GetIncomingConnectionsHandler implements IHandler<FConnectorBase[], FConnectionBase[]> {

  private get fConnections(): FConnectionBase[] {
    return this.fComponentsStore.fConnections;
  }

  constructor(
      private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(inputs: FConnectorBase[]): FConnectionBase[] {
    const inputsIds = inputs.map((x) => x.id);
    return this.fConnections.filter((x) => {
      return inputsIds.includes(x.fInputId);
    })!;
  }
}
