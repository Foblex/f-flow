import { CalculateTableOfContentRequest } from './calculate-table-of-content-request';
import { inject, Injectable, Injector } from '@angular/core';
import { DocumentationStore } from '../../../../services';
import { ITableOfContentItem, TableOfContentData } from '../../models';
import { IExecution, MExecution } from '../../../../../mediatr';
import {
  CalculateHashFromScrollPosition,
} from '../calculate-hash-from-scroll-position';

@Injectable()
@MExecution(CalculateTableOfContentRequest)
export class CalculateTableOfContent implements IExecution<CalculateTableOfContentRequest, void>{

  private readonly _dataProvider = inject(DocumentationStore);
  private readonly _injector = inject(Injector);

  public handle(request: CalculateTableOfContentRequest): void {
    const flat: ITableOfContentItem[] = [];
    const tree: ITableOfContentItem[] = [];
    const stack: ITableOfContentItem[] = [];

    this._getNavigationSelectors(request.hostElement, this._dataProvider.getTableOfContent()?.range).forEach((element) => {
      const tocItem = this._createItem(element);
      this._insertItemIntoTree(tocItem, tree, stack);
      flat.push(tocItem);
    });

    this._dataProvider.tocData.set(new TableOfContentData(flat, tree));
    this._injector.get(CalculateHashFromScrollPosition).handle();
  }

  private _getNavigationSelectors(fMarkdownPage: HTMLElement, tocRange?: {
    start: number,
    end: number
  }): HTMLElement[] {
    if (!tocRange || tocRange.start < 1 || tocRange.end > 6) {
      tocRange = { start: 2, end: 6 };
    }
    const selectors: string[] = [];
    for (let i = tocRange.start; i <= tocRange.end; i++) {
      selectors.push(`h${i}`);
    }
    return Array.from(fMarkdownPage.querySelectorAll(selectors.join(', ')));
  }

  private _createItem(element: HTMLElement): ITableOfContentItem {
    element.id = this._createNavigationId(element);
    return {
      hash: `#${CSS.escape(element.id)}`,
      title: element.innerHTML,
      element,
      children: [],
    };
  }

  private _createNavigationId(element: HTMLElement): string {
    return element.innerHTML.toLowerCase().replaceAll(' ', '-');
  }

  private _getLevel(element: HTMLElement): number {
    return parseInt(element.tagName.substring(1));
  }

  private _insertItemIntoTree(tocItem: ITableOfContentItem, tree: ITableOfContentItem[], stack: ITableOfContentItem[]): void {
    while (stack.length > 0 && this._getLevel(stack[stack.length - 1].element) >= this._getLevel(tocItem.element)) {
      stack.pop();
    }

    if (stack.length === 0) {
      tree.push(tocItem);
    } else {
      stack[stack.length - 1].children.push(tocItem);
    }

    stack.push(tocItem);
  }
}
