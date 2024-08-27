import { EDbTableFieldType } from './e-db-table-field-type';

export interface IDbTableField {

  id: string;

  name: string;

  type: EDbTableFieldType;
}
