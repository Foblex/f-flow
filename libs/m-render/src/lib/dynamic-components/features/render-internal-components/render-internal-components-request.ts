import { ViewContainerRef } from '@angular/core';

export class RenderInternalComponentsRequest {
  public static readonly requestToken = Symbol('RenderInternalComponentsRequest');

  constructor(
    public readonly hostElement: HTMLElement,
    public readonly viewContainerRef: ViewContainerRef,
  ) {
  }
}
