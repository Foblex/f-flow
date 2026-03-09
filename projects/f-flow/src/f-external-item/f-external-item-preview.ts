import { Directive, inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { F_EXTERNAL_ITEM } from './f-external-item-base';

@Directive({
  selector: 'ng-template[fExternalItemPreview]',
  standalone: true,
  host: {
    class: 'f-component f-external-item-preview',
  },
})
export class FExternalItemPreview<T = unknown> implements OnInit, OnDestroy {
  private readonly _instance = inject(F_EXTERNAL_ITEM);
  private readonly _templateRef = inject<TemplateRef<T>>(TemplateRef);

  public ngOnInit(): void {
    this._instance.preview.set(this._templateRef);
  }

  public ngOnDestroy(): void {
    this._instance.preview.set(undefined);
  }
}
