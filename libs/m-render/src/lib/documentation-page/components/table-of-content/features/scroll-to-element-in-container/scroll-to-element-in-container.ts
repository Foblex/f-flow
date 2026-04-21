import { ScrollToElementInContainerRequest } from './scroll-to-element-in-container-request';
import { inject, Injectable } from '@angular/core';
import { SCROLLABLE_CONTAINER } from '../../../index';
import { IExecution, MExecution } from '../../../../../mediatr';
import { DOCUMENT_ELEMENT, WINDOW } from '../../../../../common';

@Injectable()
@MExecution(ScrollToElementInContainerRequest)
export class ScrollToElementInContainer implements IExecution<ScrollToElementInContainerRequest, void> {

  private readonly _scrollableContainer = inject(SCROLLABLE_CONTAINER);
  private readonly _window = inject(WINDOW);
  private readonly _docElement = inject(DOCUMENT_ELEMENT);

  public handle(payload: ScrollToElementInContainerRequest): void {
    const container = this._scrollableContainer.htmlElement;
    container._ignoreProgrammatic = true;

    this._scrollableContainer.htmlElement.scrollTo({
      top: this._getScrollTo(this._getScrollToElement(payload.hash)) - this._getHeaderHeight(),
      behavior: 'smooth',
    });
  }

  private _getHeaderHeight(): number {
    return parseInt(this._window
      .getComputedStyle(this._docElement)
      .getPropertyValue('--header-height'), 10,
    );
  }

  private _getScrollToElement(hash: string): HTMLElement {
    const element = this._scrollableContainer.htmlElement?.querySelector(hash) as HTMLElement;
    if (!element) {
      throw new Error(`Element ${ hash } not found`);
    }
    return element;
  }

  private _getScrollTo(element: HTMLElement): number {
    return this._isFirstElementInContainer(element) ? 0 : this._calculateScrollTo(element);
  }

  private _isFirstElementInContainer(element: HTMLElement): boolean {
    return element.parentElement!.children[ 0 ] === element;
  }

  private _calculateScrollTo(element: HTMLElement): number {
    return this._getElementTop(element) - this._getContainerTop() + this._scrollableContainer.htmlElement.scrollTop;
  }

  private _getElementTop(element: HTMLElement): number {
    return element.getBoundingClientRect().top;
  }

  private _getContainerTop(): number {
    return this._scrollableContainer.htmlElement.getBoundingClientRect().top;
  }
}
