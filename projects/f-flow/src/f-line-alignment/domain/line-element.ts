import { DomElementExtensions } from '@foblex/core';
import { ILineAlignmentRect } from './i-line-alignment-rect';

export class LineElement {

  private readonly element: HTMLElement = DomElementExtensions.createHtmlElement('div');

  constructor(
      private readonly hostElement: HTMLElement,
  ) {
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
