import { ILineAlignmentRect } from './i-line-alignment-rect';
import { BrowserService } from '@foblex/platform';

export class SnapLineElement {
  private readonly _element: HTMLElement;

  constructor(browser: BrowserService, hostElement: HTMLElement) {
    this._element = browser.document.createElement('div');
    hostElement.appendChild(this._element);
    this._element.classList.add('f-line');
  }

  public hide(): void {
    this._element.style.display = 'none';
  }

  public show(): void {
    this._element.style.display = 'block';
  }

  public draw(object: Partial<ILineAlignmentRect>): void {
    this._element.style.position = 'absolute';

    type RectKey = keyof ILineAlignmentRect;
    for (const [prop, value] of Object.entries(object) as [RectKey, number | undefined][]) {
      if (value != null) {
        this._element.style.setProperty(prop as string, `${value}px`);
      }
    }
    //
    //
    // Object.keys(object).forEach((key: string) => {
    //   this.element.style[ key ] = object[ key ] + 'px';
    // });
  }
}
