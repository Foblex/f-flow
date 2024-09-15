import { IHandler } from '@foblex/mediator';
import { RemoveConnectionRequest } from './remove-connection.request';
import { IDatabaseStorage } from '../../database.storage';

export class RemoveConnectionHandler implements IHandler<RemoveConnectionRequest> {

  constructor(
    private storage: IDatabaseStorage
  ) {
  }

  public handle(request: RemoveConnectionRequest): void {
    const index = this.getConnectionIndex(request.id);
    this.storage.connections.splice(index, 1);
  }

  private getConnectionIndex(id: string): number {
    const index = this.storage.connections.findIndex((x) => x.id === id);
    if (index === -1) {
      throw new Error(`Connection with id ${ id } not found`);
    }
    return index;
  }
}
