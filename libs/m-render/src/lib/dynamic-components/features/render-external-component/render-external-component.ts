import { RenderExternalComponentRequest } from './render-external-component-request';
import { inject, Injectable } from '@angular/core';
import { IExecution, Mediatr, MExecution } from '../../../mediatr';
import { RenderDynamicComponentRequest } from '../render-dynamic-component';
import { EXTERNAL_COMPONENT_PROVIDER } from '../../providers';

@Injectable()
@MExecution(RenderExternalComponentRequest)
export class RenderExternalComponent implements IExecution<RenderExternalComponentRequest, void> {

  private readonly _mediatr = inject(Mediatr);
  private readonly _componentsMap = inject(EXTERNAL_COMPONENT_PROVIDER, { optional: true }) ?? [];

  public handle({ selector, viewContainerRef }: RenderExternalComponentRequest): void {
    if (!selector) {
      console.warn('Empty selector passed to RenderExternalComponentRequest.');
      return;
    }

    const item = this._componentsMap.find((x) => {
      return x.selector === selector;
    });

    if (!item) {
      console.error(`Component for tag "${selector}" could not be found in external components map.`);
      return;
    }

    this._mediatr.execute(
      new RenderDynamicComponentRequest(item, viewContainerRef),
    );
  }
}
