import { Injectable } from '@angular/core';
import { IPoint } from '@foblex/core';
import { IDatabaseModel } from './i-database-model';
import { DATABASE_STORAGE, IDatabaseStorage } from './database.storage';
import {
  ChangeConnectionTypeHandler,
  ChangeConnectionTypeRequest,
  CreateConnectionHandler,
  CreateConnectionRequest,
  ETableRelationType,
  ReassignConnectionHandler, ReassignConnectionRequest,
  RemoveConnectionHandler,
  RemoveConnectionRequest,
  ToConnectionViewModelHandler
} from './connection';
import {
  CreateColumnHandler, CreateColumnRequest,
  CreateTableHandler,
  CreateTableRequest, ETableColumnKey,
  MoveTableHandler,
  MoveTableRequest, RemoveColumnHandler, RemoveColumnRequest, RemoveTableHandler, RemoveTableRequest,
  ToTableViewModelHandler
} from './table';
import { Observable, Subject } from 'rxjs';
import { ChangeColumnKeyHandler } from './table/change-column-key/change-column-key.handler';
import { ChangeColumnKeyRequest } from './table/change-column-key/change-column-key.request';
import { ToGroupViewModelHandler } from './group';



@Injectable()
export class DatabaseApiService {

  private storage: IDatabaseStorage = DATABASE_STORAGE;

  private reload: Subject<EReloadReason> = new Subject<EReloadReason>();

  public get reload$(): Observable<EReloadReason> {
    return this.reload.asObservable();
  }

  public get(): IDatabaseModel {
    return {
      tables: new ToTableViewModelHandler(this.storage).handle(),
      groups: new ToGroupViewModelHandler(this.storage).handle(),
      connections: new ToConnectionViewModelHandler(this.storage).handle(),
    }
  }

  public createTable(position: IPoint): void {
    new CreateTableHandler(this.storage).handle(
      new CreateTableRequest(position)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public createColumn(tableId: string): void {
    new CreateColumnHandler(this.storage).handle(
      new CreateColumnRequest(tableId)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public removeColumn(tableId: string, columnId: string): void {
    new RemoveColumnHandler(this.storage).handle(
      new RemoveColumnRequest(tableId, columnId)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public changeColumnKey(tableId: string, columnId: string, key: ETableColumnKey | null): void {
    console.log('changeColumnKey', tableId, columnId, key);
    new ChangeColumnKeyHandler(this.storage).handle(
      new ChangeColumnKeyRequest(tableId, columnId, key)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public moveTable(id: string, position: IPoint): void {
    new MoveTableHandler(this.storage).handle(
      new MoveTableRequest(id, position)
    );
  }

  public removeTable(id: string): void {
    new RemoveTableHandler(this.storage).handle(
      new RemoveTableRequest(id)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public createConnection(outputId: string, inputId: string, type: ETableRelationType): void {
    new CreateConnectionHandler(this.storage).handle(
      new CreateConnectionRequest(outputId, inputId, type)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public reassignConnection(connectionId: string, inputId: string): void {
    new ReassignConnectionHandler(this.storage).handle(
      new ReassignConnectionRequest(connectionId, inputId)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public changeConnectionType(connectionId: string, type: ETableRelationType): void {
    new ChangeConnectionTypeHandler(this.storage).handle(
      new ChangeConnectionTypeRequest(connectionId, type)
    );
    this.reload.next(EReloadReason.CONNECTION_CHANGED);
  }

  public removeConnection(connectionId: string): void {
    new RemoveConnectionHandler(this.storage).handle(
      new RemoveConnectionRequest(connectionId)
    );
    this.reload.next(EReloadReason.CONNECTION_CHANGED);
  }
}

export enum EReloadReason {

  JUST_RELOAD,

  CONNECTION_CHANGED,
}
