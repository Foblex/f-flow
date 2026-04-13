import { ITableConnectionViewModel } from './connection';
import { ITableViewModel } from './table';
import { IGroupViewModel } from './group';

export interface IDatabaseModel {

  tables: ITableViewModel[];

  groups: IGroupViewModel[];

  connections: ITableConnectionViewModel[];
}
