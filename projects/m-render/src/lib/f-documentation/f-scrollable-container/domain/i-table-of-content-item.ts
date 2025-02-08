export interface ITableOfContentItem {

  element: HTMLElement;

  hash: string;

  title: string;

  isActive?: boolean;

  children: ITableOfContentItem[];
}
