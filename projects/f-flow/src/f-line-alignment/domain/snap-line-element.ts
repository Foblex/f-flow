import { ILineAlignmentRect } from './i-line-alignment-rect';
import { BrowserService } from '@foblex/platform';

export class SnapLineElement {

  private readonly element: HTMLElement;

  constructor(
    browser: BrowserService,
    hostElement: HTMLElement,
  ) {
    this.element = browser.document.createElement('div');
    hostElement.appendChild(this.element);
    this.element.classList.add('f-line');
  }

  public hide(): void {
    this.element.style.display = 'none';
  }

  public show(): void {
    this.element.style.display = 'block'
  }

  public draw(object: Partial<ILineAlignmentRect>): void {
    this.element.style.position = 'absolute';

    type RectKey = keyof ILineAlignmentRect;
    for (const [prop, value] of Object.entries(object) as [RectKey, number | undefined][]) {
      if (value != null) {
        this.element.style.setProperty(prop as string, `${value}px`);
      }
    }
    //
    //
    // Object.keys(object).forEach((key: string) => {
    //   this.element.style[ key ] = object[ key ] + 'px';
    // });
  }
}

