import { RenderDynamicComponentRequest } from './render-dynamic-component-request';
import {
  ComponentRef,
  DestroyRef,
  EmbeddedViewRef,
  inject,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { DynamicComponentsStore } from '../../dynamic-components.store';
import { IExecution, MExecution } from '../../../mediatr';
import { IDynamicComponentInstance, IDynamicComponentItem } from '../../models';

@Injectable()
@MExecution(RenderDynamicComponentRequest)
export class RenderDynamicComponent implements IExecution<RenderDynamicComponentRequest, void> {
  private readonly _dynamicStore = inject(DynamicComponentsStore);

  public handle({ item, viewContainerRef, element }: RenderDynamicComponentRequest): void {
    try {
      this._renderComponent(item, viewContainerRef, element);
    } catch (error) {
      this._logError(item.selector, error);
    }
  }

  private _renderComponent(
    { selector, component }: IDynamicComponentItem,
    viewContainerRef: ViewContainerRef,
    element?: HTMLElement,
  ): void {
    const destroyRef = viewContainerRef.injector.get(DestroyRef);
    const renderGeneration = this._dynamicStore.renderGeneration;

    component
      .then((extracted) => {
        if (destroyRef.destroyed || !this._dynamicStore.isCurrentRender(renderGeneration)) {
          return;
        }

        if (!extracted) {
          this._logComponentResolutionError(selector);

          return;
        }

        const componentRef = viewContainerRef.createComponent(extracted, {
          injector: viewContainerRef.injector,
        });
        this._dynamicStore.addComponent(componentRef, element);

        element?.replaceWith(this._extractComponentRoot(componentRef));
      })
      .catch((error) => this._logComponentLoadingError(selector, error));
  }

  private _extractComponentRoot(
    componentRef: ComponentRef<IDynamicComponentInstance>,
  ): HTMLElement {
    componentRef.changeDetectorRef.markForCheck();

    return (componentRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
  }

  private _logComponentResolutionError(tag: string): void {
    console.error(`Component for tag "${tag}" could not be resolved.`);
  }

  private _logComponentLoadingError(tag: string, error: unknown): void {
    console.error(`Error while loading component for tag "${tag}":`, error);
  }

  private _logError(tag: string, error: unknown): void {
    console.error(`Error inserting component for <${tag}>:`, error);
  }
}
