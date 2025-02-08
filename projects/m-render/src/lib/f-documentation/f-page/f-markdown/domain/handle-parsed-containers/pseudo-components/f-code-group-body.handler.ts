import { FCodeViewHandler } from './f-code-view-handler';
import { FExampleViewHandler } from './f-example-view-handler';
import { IParsedContainer } from '../i-parsed-container';
import { ICodeGroupView } from './f-code-group';
import { Injector } from '@angular/core';
import { FAsyncCodeViewHandler } from './f-async-code-view-handler';

type DisposableContainer = IParsedContainer & ICodeGroupView;

export class FCodeGroupBodyHandler implements IParsedContainer {

  private fContainerHandlers: DisposableContainer[];

  constructor(
    public element: HTMLElement,
    private injector: Injector
  ) {
    this.fContainerHandlers = this.getCodeViews();
    this.initialize();
  }

  private initialize(): void {
    this.toggle(0);
  }

  private getCodeViews(): DisposableContainer[] {
    return this.getGroupBodyChildren().map((x) => {
      if (this.isCodeView(x)) {
        return new FCodeViewHandler(x as HTMLElement, this.injector);
      } else if (this.isAsyncCodeView(x)) {
        return new FAsyncCodeViewHandler(x as HTMLElement, this.injector);
      } else {
        return new FExampleViewHandler(x as HTMLElement);
      }
    });
  }

  private getGroupBodyChildren(): HTMLElement[] {
    return Array.from(this.element.querySelector('.f-code-group-body')!.children) as HTMLElement[];
  }

  private isCodeView(element: Element): boolean {
    return element.classList.contains('f-code-view');
  }

  private isAsyncCodeView(element: Element): boolean {
    return element.classList.contains('f-async-code-view');
  }

  public toggle(index: number): void {
    this.fContainerHandlers.forEach((fContainer, tabIndex) => {
      fContainer.setDisplay(tabIndex === index ? 'block' : 'none');
    });
  }

  public dispose(): void {
    this.fContainerHandlers.forEach((x) => x.dispose?.());
  }
}
