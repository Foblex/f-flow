import { IPoint } from '@foblex/core';
import { ITableColumn } from './i-table-column';

export interface ITableStorageModel {

  id: string;

  name: string;

  columns: ITableColumn[];

  position: IPoint;

  parentId?: string;
}
