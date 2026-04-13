import { IPoint } from '@foblex/2d';
import { ITableColumn } from './i-table-column';

export interface ITableStorageModel {

  id: string;

  name: string;

  columns: ITableColumn[];

  connectOnNode?: boolean;

  position: IPoint;

  parentId?: string;
}
