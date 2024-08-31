import { ITableConnectionViewModel } from './connection/i-table-connection-view-model';
import { ITableViewModel } from './table/i-table-view-model';

export interface IDatabaseModel {

  tables: ITableViewModel[];

  connections: ITableConnectionViewModel[];
}
