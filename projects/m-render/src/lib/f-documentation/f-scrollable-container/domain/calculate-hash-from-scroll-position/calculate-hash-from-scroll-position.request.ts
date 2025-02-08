import { ITableOfContentItem } from '../i-table-of-content-item';

export class CalculateHashFromScrollPositionRequest {
  constructor(
    public tocData: ITableOfContentItem[]
  ) {
  }
}
