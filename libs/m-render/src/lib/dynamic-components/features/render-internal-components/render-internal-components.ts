import { RenderInternalComponentsRequest } from './render-internal-components-request';
import { inject, Injectable } from '@angular/core';
import { IExecution, Mediatr, MExecution } from '../../../mediatr';
import { IDynamicComponentItem } from '../../models';
import { DynamicComponentsStore, extractComponent } from '../../../documentation-page';
import { RenderDynamicComponentRequest } from '../render-dynamic-component';

@Injectable()
@MExecution(RenderInternalComponentsRequest)
export class RenderInternalComponents implements IExecution<RenderInternalComponentsRequest, void> {
  private readonly _dynamicStore = inject(DynamicComponentsStore);
  private readonly _mediatr = inject(Mediatr);

  private readonly _componentsMap: IDynamicComponentItem[] = [
    {
      selector: 'f-code-group',
      component: extractComponent(() => import('../../components/code-group/code-group')),
    },
    {
      selector: 'f-preview',
      component: extractComponent(() => import('../../components/preview-group/components/preview-card/preview-card')),
    },
    {
      selector: 'f-preview-group-filters',
      component: extractComponent(() => import('../../components/preview-group/components/preview-action-bar/preview-action-bar')),
    },
    {
      selector: 'showcase',
      component: extractComponent(() => import('../../components/showcase/showcase')),
    },
  ];

  public handle({ hostElement, viewContainerRef }: RenderInternalComponentsRequest): void {
    this._dynamicStore.dispose();

    this._componentsMap.forEach(({ selector, component }) => {
      this._queryElements(hostElement, selector).forEach((x) => {
        this._mediatr.execute(
          new RenderDynamicComponentRequest({ selector, component }, viewContainerRef, x),
        );
      });
    });
  }

  private _queryElements(hostElement: HTMLElement, selector: string): HTMLElement[] {
    return Array.from(hostElement.querySelectorAll(selector));
  }
}
