import { IPoint } from '@foblex/core';
import { IDbTableField } from '../i-db-table-field';

export interface IFlowNodeStorageModel {

  id: string;

  name?: string;

  position: IPoint;

  fields: IDbTableField[];
}
