import { ViewContainerRef } from '@angular/core';
import { IDynamicComponentItem } from '../../models';

export class RenderDynamicComponentRequest {
  static readonly requestToken = Symbol('RenderDynamicComponentRequest');

  constructor(
    public readonly item: IDynamicComponentItem,
    public readonly viewContainerRef: ViewContainerRef,
    public readonly element?: HTMLElement,
  ) {
  }
}
