import { IWalkthroughTooltip } from './i-walkthrough-tooltip';

export class WalkthroughTooltipHandler {

  private _refs: HTMLElement[] = [];

  public handle(tooltips?: IWalkthroughTooltip[]) {
    if (!tooltips) {
      return;
    }

    tooltips.forEach((x) => {
      const origin = this._getOrigin(x.origin.selector);
      if (!origin) {
        console.warn(`Origin not found: ${ x.origin.selector }`);
        return;
      }
      const ref = this._createElement(x);
      this._setElementPosition(origin, ref, x);
      ref.innerHTML = `<h3>${ x.content }</h3>`;
      this._refs.push(ref);
      document.body.appendChild(ref);
    });
  }

  public dispose(): void {
    this._refs.forEach((ref) => {
      ref.remove();
    });
    this._refs = [];
  }

  private _createElement(tooltip: IWalkthroughTooltip): HTMLElement {
    const element = document.createElement('div');
    element.style.position = 'fixed';
    if (tooltip.style) {
      Object.entries(tooltip.style).forEach(([ key, value ]) => {
        if (value != null && key in element.style) {
          (element.style as any)[ key ] = value;
        }
      });
    }
    element.style.zIndex = tooltip.style?.zIndex || '100001';
    return element;
  }

  private _setElementPosition(origin: HTMLElement, element: HTMLElement, tooltip: IWalkthroughTooltip) {
    const rect = origin.getBoundingClientRect();
    this._setHorizontalPosition(rect, element, tooltip);
    this._setVerticalPosition(rect, element, tooltip);
  }

  private _setHorizontalPosition(rect: DOMRect, element: HTMLElement, tooltip: IWalkthroughTooltip) {
    switch (tooltip.origin.position.x) {
      case 'start':
        element.style.left = `${ rect.left }px`;
        break;
      case 'center':
        element.style.left = `${ rect.left + rect.width / 2 - element.offsetWidth / 2 }px`;
        break;
      case 'end':
        element.style.left = `${ rect.left + rect.width - element.offsetWidth }px`;
        break;
    }
  }

  private _setVerticalPosition(rect: DOMRect, element: HTMLElement, tooltip: IWalkthroughTooltip) {
    switch (tooltip.origin.position.y) {
      case 'top':
        element.style.top = `${ rect.top }px`;
        break;
      case 'center':
        element.style.top = `${ rect.top + rect.height / 2 - element.offsetHeight / 2 }px`;
        break;
      case 'bottom':
        element.style.top = `${ rect.top + rect.height - element.offsetHeight }px`;
        break;
    }
  }

  private _getOrigin(selector?: string): HTMLElement | null {
    if (!selector) {
      throw new Error('No selector provided for origin');
    }
    return document.querySelector<HTMLElement>(selector);
  }
}
