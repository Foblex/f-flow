import { IHandler } from '@foblex/mediator';
import { HandleDynamicComponentsRequest } from './handle-dynamic-components.request';
import { ComponentRef, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { FDocumentationEnvironmentService, FPreviewComponent, FPreviewGroupFiltersComponent } from '../../../../index';

@Injectable()
export class HandleDynamicComponentsHandler implements IHandler<HandleDynamicComponentsRequest> {
  private componentRefs: ComponentRef<any>[] = [];

  constructor(
    private fEnvironmentService: FDocumentationEnvironmentService,
    private injector: Injector,
  ) {
  }

  public handle(request: HandleDynamicComponentsRequest): void {
    this.dispose();
    const components = [
      {
        tag: 'f-preview', component: FPreviewComponent,
      },
      {
        tag: 'f-preview-group-filters', component: FPreviewGroupFiltersComponent,
      },
      ...this.fEnvironmentService.getComponents()
    ];

    components.forEach((data) => {
      const elements = this.getDynamicElements(request.hostElement, data.tag);
      if (elements.length) {
        if (this.isPromise(data.component)) {
          data.component.then(module => {
            const component = this.extractComponent(module);
            if (component) {
              this.replaceElementsWithComponent(elements, component, data.tag);
            } else {
              this.logComponentResolutionError(data.tag);
            }
          }).catch(error => this.logComponentLoadingError(data.tag, error));
        } else {
          this.replaceElementsWithComponent(elements, data.component, data.tag);
        }
      }
    });
  }

  private getDynamicElements(hostElement: HTMLElement, tag: string): HTMLElement[] {
    return Array.from(hostElement.querySelectorAll(tag));
  }

  private isPromise(value: any): value is Promise<any> {
    return value && typeof value.then === 'function';
  }

  private extractComponent(module: any): Type<any> | null {
    return module && module.default ? module.default : Object.values(module)[ 0 ] as Type<any>;
  }

  private replaceElementsWithComponent(elements: HTMLElement[], component: Type<any>, tag: string): void {
    elements.forEach((x) => {
      try {
        this.changeElementToComponent(x, component);
      } catch (error) {
        this.logComponentInsertionError(tag, error);
      }
    });
  }

  private changeElementToComponent(element: HTMLElement, component: Type<any>): void {
    try {
      const componentRef = this.getComponentReference(component);
      this.componentRefs.push(componentRef);
      if (!element.dataset) {
        return;
      }
      Object.keys(element.dataset).forEach((key) => componentRef.instance[ key ] = element.dataset[ key ]);
      componentRef.instance?.initialize?.();
      element.parentElement!.replaceChild(this.getComponentElement(componentRef), element);
    } catch (error) {
      console.error(`Error while inserting component: ${ component.name }`, error);
    }
  }

  private getComponentReference<T>(component: Type<T>): ComponentRef<T> {
    return this.injector.get(ViewContainerRef).createComponent(component);
  }

  private getComponentElement(componentRef: ComponentRef<any>): HTMLElement {
    this.requestComponentRedraw(componentRef);
    return (componentRef.hostView as any).rootNodes[ 0 ] as HTMLElement;
  }

  private requestComponentRedraw(componentRef: ComponentRef<any>): void {
    componentRef.changeDetectorRef.markForCheck();
  }

  private logComponentResolutionError(tag: string, error?: any): void {
    console.error(`Component for tag "${ tag }" could not be resolved.`, error);
  }

  private logComponentLoadingError(tag: string, error: any): void {
    console.error(`Error while loading component for tag "${ tag }":`, error);
  }

  private logComponentInsertionError(tag: string, error: any): void {
    console.error(`Error while inserting component for tag "${ tag }":`, error);
  }

  public dispose(): void {
    this.componentRefs.forEach((ref) => ref.destroy());
    this.componentRefs = [];
  }
}

