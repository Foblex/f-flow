import { ILineAlignmentRect } from './i-line-alignment-rect';
import { BrowserService } from '@foblex/platform';

export class SnapLineElement {

  private readonly element: HTMLElement;

  constructor(
    fBrowser: BrowserService,
    private readonly hostElement: HTMLElement,
  ) {
    this.element = fBrowser.document.createElement('div');
    this.hostElement.appendChild(this.element);
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
    Object.keys(object).forEach((key: string) => {
      // @ts-ignore
      this.element.style[ key ] = object[ key ] + 'px';
    });
  }
}

