import { IHandler } from '@foblex/mediator';
import { GetTableOfContentDataRequest } from './get-table-of-content-data.request';
import { ITableOfContentItem } from '../i-table-of-content-item';
import { TableOfContentData } from '../table-of-content-data';

export class GetTableOfContentDataHandler implements IHandler<GetTableOfContentDataRequest, TableOfContentData> {

  public handle(request: GetTableOfContentDataRequest): TableOfContentData {
    const flat: ITableOfContentItem[] = [];
    const tree: ITableOfContentItem[] = [];
    const stack: ITableOfContentItem[] = [];

    this.getNavigationSelectors(request.fMarkdownPage, request.tocRange).forEach((element) => {
      const tocItem: ITableOfContentItem = this.createItem(element);
      this.insertItemIntoTree(tocItem, tree, stack);
      flat.push(tocItem);
    });

    return new TableOfContentData(flat, tree);
  }

  private getNavigationSelectors(fMarkdownPage: HTMLElement, tocRange?: { start: number, end: number }): HTMLElement[] {
    if(!tocRange || tocRange.start < 1 || tocRange.end > 6) {
      tocRange = { start: 1, end: 6 };
    }
    let selectors: string[] = [];
    for(let i = tocRange.start; i <= tocRange.end; i++) {
      selectors.push(`h${i}`);
    }
    return Array.from(fMarkdownPage.querySelectorAll(selectors.join(', ')));
  }

  private createItem(element: HTMLElement): ITableOfContentItem {
    element.id = this.createNavigationId(element);
    return {
      hash: `#${ element.id }`,
      title: element.innerHTML,
      element,
      children: []
    };
  }

  private createNavigationId(element: HTMLElement): string {
    return element.innerHTML.toLowerCase().replaceAll(' ', '-');
  }

  private getLevel(element: HTMLElement): number {
    return parseInt(element.tagName.substring(1));
  }

  private insertItemIntoTree(tocItem: ITableOfContentItem, tree: ITableOfContentItem[], stack: ITableOfContentItem[]): void {
    while (stack.length > 0 && this.getLevel(stack[ stack.length - 1 ].element) >= this.getLevel(tocItem.element)) {
      stack.pop();
    }

    if (stack.length === 0) {
      tree.push(tocItem);
    } else {
      stack[ stack.length - 1 ].children.push(tocItem);
    }

    stack.push(tocItem);
  }
}
