import { Directive, inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { F_EXTERNAL_ITEM } from './f-external-item-token';

@Directive({
  selector: 'ng-template[fExternalItemPreview]',
  standalone: true,
  host: {
    class: 'f-component f-external-item-preview',
  },
})
export class FExternalItemPreviewDirective<T = unknown> implements OnInit, OnDestroy {
  private readonly _fExternalItem = inject(F_EXTERNAL_ITEM);
  private readonly _templateRef = inject<TemplateRef<T>>(TemplateRef);

  public ngOnInit(): void {
    this._fExternalItem.fPreview = this._templateRef;
  }

  public ngOnDestroy(): void {
    this._fExternalItem.fPreview = undefined;
  }
}
