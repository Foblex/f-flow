import { ETableRelationType } from './e-table-relation-type';

export interface ITableConnectionStorageModel {

  id: string;

  from: string;

  to: string;

  type: ETableRelationType;
}
