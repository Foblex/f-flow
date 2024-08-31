import { ETableColumnKey } from '../e-table-column-key';

export class ChangeColumnKeyRequest {

  constructor(
    public readonly tableId: string,
    public readonly columnId: string,
    public readonly key: ETableColumnKey | null
  ) {
  }
}
