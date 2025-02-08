import { IHandler } from '@foblex/mediator';
import { CalculateHashFromScrollPositionRequest } from './calculate-hash-from-scroll-position.request';
import { ITableOfContentItem } from '../i-table-of-content-item';
import { GetAbsoluteTopToContainerHandler, GetAbsoluteTopToContainerRequest } from '../get-absolute-top-to-container';
import { BrowserService } from '@foblex/platform';

interface IHasTopItem {

  hash: string;

  top: number;
}

export class CalculateHashFromScrollPositionHandler implements IHandler<CalculateHashFromScrollPositionRequest, string | undefined> {

  constructor(
    private scrollableContainer: HTMLElement,
    private fBrowser: BrowserService
  ) {
  }

  public handle(request: CalculateHashFromScrollPositionRequest): string | undefined {
    let result: string | undefined;
    const containerScrollTop = this.getContainerScrollTop();

    const elementsWithTopPosition = this.calculateElementsTopPositions(request.tocData);

    if (elementsWithTopPosition.length) {
      if (this.isScrollAtBottom(containerScrollTop)) {
        result = elementsWithTopPosition[ elementsWithTopPosition.length - 1 ].hash;
      } else {
        result = this.findTargetHashByPosition(containerScrollTop, elementsWithTopPosition);
      }
    }
    return result;
  }

  private getContainerScrollTop(): number {
    return this.scrollableContainer.scrollTop + this.getHeaderHeight();
  }

  private getHeaderHeight(): number {
    return parseInt(this.fBrowser.window.getComputedStyle(this.fBrowser.document.documentElement).getPropertyValue('--header-height'), 10);
  }

  private calculateElementsTopPositions(items: ITableOfContentItem[]): IHasTopItem[] {
    return items.map((x) => {
      return {
        hash: x.hash,
        top: this.getAbsoluteTopToContainer(x.element)
      }
    }).filter((x) => !Number.isNaN(x.top));
  }

  private getAbsoluteTopToContainer(element: HTMLElement): number {
    return new GetAbsoluteTopToContainerHandler().handle(
      new GetAbsoluteTopToContainerRequest(element, this.scrollableContainer)
    );
  }

  private isScrollAtBottom(containerScrollTop: number): boolean {
    return Math.abs(containerScrollTop - this.getHeaderHeight() + this.scrollableContainer.clientHeight - this.scrollableContainer.scrollHeight) < 1;
  }

  private findTargetHashByPosition(containerScrollTop: number, elementsWithTopPosition: IHasTopItem[]): string {
    let result: string = elementsWithTopPosition[ 0 ].hash;
    for (const { hash, top } of elementsWithTopPosition) {
      if (top > containerScrollTop) break;
      result = hash;
    }
    return result;
  }
}
