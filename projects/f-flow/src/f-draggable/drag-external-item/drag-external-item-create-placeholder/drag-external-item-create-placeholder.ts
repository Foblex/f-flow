import { DragExternalItemCreatePlaceholderRequest } from './drag-external-item-create-placeholder-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { EmbeddedViewRef, inject, Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { deepCloneNode, getOrCreateRootNodeForViewRef } from '@foblex/utils';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(DragExternalItemCreatePlaceholderRequest)
export class DragExternalItemCreatePlaceholder implements IExecution<
  DragExternalItemCreatePlaceholderRequest,
  HTMLElement | SVGElement
> {
  private readonly _browser = inject(BrowserService);
  private readonly _containerRef = inject(ViewContainerRef);

  public handle({
    externalItem,
  }: DragExternalItemCreatePlaceholderRequest): HTMLElement | SVGElement {
    const { hostElement, placeholder } = externalItem;

    const placeholderElement = placeholder();

    const result = placeholderElement
      ? this._fromTemplate(placeholderElement)
      : this._fromHost(hostElement as HTMLElement);

    result.classList.add('f-external-item-placeholder');
    result.style.pointerEvents = 'none';

    return result;
  }

  private _fromTemplate(template: TemplateRef<unknown>): HTMLElement {
    return getOrCreateRootNodeForViewRef(this._createViewRef(template), this._browser.document);
  }

  private _fromHost(element: HTMLElement): HTMLElement {
    return deepCloneNode(element);
  }

  private _createViewRef(template: TemplateRef<unknown>): EmbeddedViewRef<unknown> {
    const result = this._containerRef.createEmbeddedView(template);
    result.detectChanges();

    return result;
  }
}
