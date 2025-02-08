import { IHandler } from '@foblex/mediator';

export class ScrollToElementInContainer implements IHandler<string, void> {

  constructor(
    private container: HTMLElement
  ) {
  }

  public handle(hash: string): void {
    this.container.scrollTo({
      top: this.getScrollTo(this.getScrollToElement(hash)) - 64,
      behavior: 'smooth'
    });
  }

  private getScrollToElement(hash: string): HTMLElement {
    const element = this.container.querySelector(hash)! as HTMLElement;
    if (!element) {
      throw new Error(`Element ${ hash } not found`);
    }
    return element;
  }

  private getScrollTo(element: HTMLElement): number {
    return this.isFirstElementInContainer(element) ? 0 : this.calculateScrollTo(element);
  }

  private isFirstElementInContainer(element: HTMLElement): boolean {
    return element.parentElement!.children[ 0 ] === element;
  }

  private calculateScrollTo(element: HTMLElement): number {
    return this.getElementTop(element) - this.getContainerTop() + this.container.scrollTop;
  }

  private getElementTop(element: HTMLElement): number {
    return element.getBoundingClientRect().top;
  }

  private getContainerTop(): number {
    return this.container.getBoundingClientRect().top;
  }
}
