import { DragExternalItemCreatePreviewRequest } from './drag-external-item-create-preview-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { EmbeddedViewRef, inject, Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import {
  deepCloneNode,
  disableDragInteractions,
  extendStyles,
  getOrCreateRootNodeForViewRef,
} from '@foblex/utils';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(DragExternalItemCreatePreviewRequest)
export class DragExternalItemCreatePreview implements IExecution<
  DragExternalItemCreatePreviewRequest,
  HTMLElement | SVGElement
> {
  private readonly _browser = inject(BrowserService);
  private readonly _containerRef = inject(ViewContainerRef);

  public handle({ externalItem }: DragExternalItemCreatePreviewRequest): HTMLElement | SVGElement {
    const { hostElement, preview } = externalItem;

    const previewElement = preview();

    const result = previewElement
      ? this._fromTemplate(previewElement)
      : this._fromHost(hostElement as HTMLElement);

    this._setPreviewStyles(result);
    disableDragInteractions(result);
    result.classList.add('f-external-item-preview');

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

  private _setPreviewStyles(element: HTMLElement): void {
    extendStyles(
      element.style,
      {
        'pointer-events': 'none',
        'margin': 'showPopover' in element ? '0 auto 0 0' : '0',
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'z-index': '1000',
      },
      new Set(['position']),
    );
  }
}
