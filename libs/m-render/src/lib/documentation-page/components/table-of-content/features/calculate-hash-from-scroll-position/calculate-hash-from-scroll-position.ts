import { CalculateAbsoluteTopToContainerRequest } from '../calculate-absolute-top-to-container';
import { inject, Injectable } from '@angular/core';
import {
  ActivateTocByHashRequest,
  SCROLLABLE_CONTAINER,
} from '../../../index';
import { DocumentationStore } from '../../../../services';
import { DOCUMENT_ELEMENT, WINDOW } from '../../../../../common';
import { IExecution, Mediatr } from '../../../../../mediatr';

@Injectable()
export class CalculateHashFromScrollPosition
  implements IExecution<void, void> {

  private readonly _docElement = inject(DOCUMENT_ELEMENT);
  private readonly _window = inject(WINDOW);
  private readonly _provider = inject(DocumentationStore);
  private readonly _scrollableContainer = inject(SCROLLABLE_CONTAINER);
  private readonly _mediatr = inject(Mediatr);

  public handle(): void {
    let result: string | undefined;
    const containerScrollTop = this._getContainerScrollTop();

    const elementsWithTopPosition = this._calculateElementsTopPositions();

    if (elementsWithTopPosition.length) {
      if (this._isScrollAtBottom(containerScrollTop)) {
        result = elementsWithTopPosition[elementsWithTopPosition.length - 1].hash;
      } else {
        result = this._findTargetHashByPosition(containerScrollTop, elementsWithTopPosition);
      }
    }
    this._mediatr.execute(new ActivateTocByHashRequest(result));
  }

  private _getContainerScrollTop(): number {
    return this._scrollableContainer.htmlElement.scrollTop + this._getHeaderHeight();
  }

  private _getHeaderHeight(): number {
    return parseInt(this._window
      .getComputedStyle(this._docElement)
      .getPropertyValue('--header-height'), 10,
    );
  }

  private _calculateElementsTopPositions(): IHasTopItem[] {
    return this._provider.tocData().flat.map((x) => {
      return {
        hash: x.hash,
        top: this._calculateAbsoluteTopToContainer(x.element),
      };
    }).filter((x) => !Number.isNaN(x.top));
  }

  private _calculateAbsoluteTopToContainer(element: HTMLElement): number {
    return this._mediatr.execute(new CalculateAbsoluteTopToContainerRequest(element));
  }

  private _isScrollAtBottom(containerScrollTop: number): boolean {
    return Math.abs(containerScrollTop - this._getHeaderHeight() + this._scrollableContainer.htmlElement.clientHeight - this._scrollableContainer.htmlElement.scrollHeight) < 1;
  }

  private _findTargetHashByPosition(containerScrollTop: number, elementsWithTopPosition: IHasTopItem[]): string {
    let result: string = elementsWithTopPosition[0].hash;
    for (const { hash, top } of elementsWithTopPosition) {
      if (top > containerScrollTop) break;
      result = hash;
    }
    return result;
  }
}

interface IHasTopItem {
  hash: string;
  top: number;
}
