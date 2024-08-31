import { ETableColumnType } from './e-table-column-type';
import { ETableColumnKey } from './e-table-column-key';

export interface ITableColumn {

  id: string;

  name: string;

  type: ETableColumnType;

  key?: ETableColumnKey;
}
