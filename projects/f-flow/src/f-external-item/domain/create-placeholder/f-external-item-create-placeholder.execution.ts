import { FExternalItemCreatePlaceholderRequest } from './f-external-item-create-placeholder.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { EmbeddedViewRef, inject, Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { deepCloneNode, getOrCreateRootNodeForViewRef } from '@foblex/utils';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(FExternalItemCreatePlaceholderRequest)
export class FExternalItemCreatePlaceholderExecution
  implements IExecution<FExternalItemCreatePlaceholderRequest, HTMLElement | SVGElement> {

  private readonly _fBrowser = inject(BrowserService);
  private readonly _containerRef = inject(ViewContainerRef);

  public handle(request: FExternalItemCreatePlaceholderRequest): HTMLElement | SVGElement {
    const { hostElement, fPlaceholder } = request.fExternalItem;

    const result = fPlaceholder ?
      this._fromTemplate(fPlaceholder) :
      this._fromHost(hostElement as HTMLElement);

    result.classList.add('f-external-item-placeholder');
    result.style.pointerEvents = 'none';

    return result;
  }

  private _fromTemplate(template: TemplateRef<any>): HTMLElement {
    return getOrCreateRootNodeForViewRef(this._createViewRef(template), this._fBrowser.document);
  }

  private _fromHost(element: HTMLElement): HTMLElement {
    return deepCloneNode(element);
  }

  private _createViewRef(template: TemplateRef<any>): EmbeddedViewRef<any> {
    const result = this._containerRef.createEmbeddedView(template);
    result.detectChanges();

    return result;
  }
}
