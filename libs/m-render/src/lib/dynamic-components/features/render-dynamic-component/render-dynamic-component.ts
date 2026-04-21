import { RenderDynamicComponentRequest } from './render-dynamic-component-request';
import { ComponentRef, inject, Injectable, ViewContainerRef } from '@angular/core';
import { DynamicComponentsStore } from '../../dynamic-components.store';
import { IExecution, MExecution } from '../../../mediatr';
import { IDynamicComponentItem } from '../../models';

@Injectable()
@MExecution(RenderDynamicComponentRequest)
export class RenderDynamicComponent implements IExecution<RenderDynamicComponentRequest, void>{

  private readonly _dynamicStore = inject(DynamicComponentsStore);

  public handle({ item, viewContainerRef, element }: RenderDynamicComponentRequest): void {
    try {
      this._renderComponent(item, viewContainerRef, element);
    } catch (error) {
      this._logError(item.selector, error);
    }
  }

  private _renderComponent({ selector, component }: IDynamicComponentItem, viewContainerRef: ViewContainerRef, element?: HTMLElement): void {
    component.then(extracted => {
      if (!extracted) {
        this._logComponentResolutionError(selector);
        return;
      }

      const componentRef = viewContainerRef.createComponent(extracted, {
        injector: viewContainerRef.injector,
      });
      this._dynamicStore.addComponent(componentRef, element);

      element?.replaceWith(this._extractComponentRoot(componentRef));
    }).catch(error => this._logComponentLoadingError(selector, error));
  }

  private _extractComponentRoot(componentRef: ComponentRef<any>): HTMLElement {
    componentRef.changeDetectorRef.markForCheck();
    return (componentRef.hostView as any).rootNodes[0] as HTMLElement;
  }

  private _logComponentResolutionError(tag: string): void {
    console.error(`Component for tag "${tag}" could not be resolved.`);
  }

  private _logComponentLoadingError(tag: string, error: object): void {
    console.error(`Error while loading component for tag "${tag}":`, error);
  }

  private _logError(tag: string, error: any): void {
    console.error(`Error inserting component for <${tag}>:`, error);
  }
}
