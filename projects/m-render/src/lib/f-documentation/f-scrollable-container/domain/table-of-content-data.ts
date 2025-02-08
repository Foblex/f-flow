import { ITableOfContentItem } from './i-table-of-content-item';

export class TableOfContentData {

  constructor(
    public flat: ITableOfContentItem[],
    public tree: ITableOfContentItem[]
  ) {
  }
}
