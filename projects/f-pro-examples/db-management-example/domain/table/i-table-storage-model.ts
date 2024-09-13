import { IPoint } from '@foblex/2d';
import { ITableColumn } from './i-table-column';

export interface ITableStorageModel {

  id: string;

  name: string;

  columns: ITableColumn[];

  position: IPoint;

  parentId?: string;
}
