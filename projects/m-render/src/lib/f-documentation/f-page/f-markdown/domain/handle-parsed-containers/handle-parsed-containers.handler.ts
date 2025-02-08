import { IHandler } from '@foblex/mediator';
import { HandleParsedContainersRequest } from './handle-parsed-containers.request';
import { Injectable, Injector } from '@angular/core';
import { FCodeGroupHandler, FCodeViewHandler } from './pseudo-components';
import { IParsedContainer } from './i-parsed-container';

@Injectable()
export class HandleParsedContainersHandler implements IHandler<HandleParsedContainersRequest> {

  private fCodeGroupHandler: IParsedContainer[] = [];

  private fCodeViewHandler: IParsedContainer[] = [];

  constructor(
    private injector: Injector,
  ) {
  }

  public handle(request: HandleParsedContainersRequest): void {
    this.dispose();
    this.fCodeGroupHandler = this.getCodeGroups(request.hostElement);
    this.fCodeViewHandler = this.getCodeViews(request.hostElement);
  }

  private getCodeGroups(hostElement: HTMLElement): IParsedContainer[] {
    return Array.from(hostElement.querySelectorAll('.f-code-group'))
      .map((x) => new FCodeGroupHandler(x as HTMLElement, this.injector));
  }

  private getCodeViews(hostElement: HTMLElement): IParsedContainer[] {
    return Array.from(hostElement.querySelectorAll('.f-code-view'))
      .filter((x) => !x.parentElement?.classList.contains('f-code-group-body'))
      .map((x) => new FCodeViewHandler(x as HTMLElement, this.injector));
  }

  public dispose(): void {
    this.fCodeGroupHandler.forEach((x) => x.dispose?.());
    this.fCodeViewHandler.forEach((x) => x.dispose?.());
  }
}
