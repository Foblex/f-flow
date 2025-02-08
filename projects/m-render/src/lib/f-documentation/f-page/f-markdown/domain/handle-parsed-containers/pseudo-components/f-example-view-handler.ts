import { ICodeGroupView } from './f-code-group';

export class FExampleViewHandler implements ICodeGroupView {

  constructor(
    public element: HTMLElement,
  ) {
  }

  public setDisplay(value: string): void {
    this.element.style.display = value;
  }
}
