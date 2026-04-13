import {
  booleanAttribute,
  Directive,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { F_EXTERNAL_ITEM, FExternalItemBase } from './f-external-item-base';
import { FExternalItemService } from './f-external-item.service';

let uniqueId = 0;

@Directive({
  selector: '[fExternalItem]',
  standalone: true,
  host: {
    '[attr.id]': 'externalItemId()',
    class: 'f-component f-external-item',
    '[class.f-external-item-disabled]': 'disabled()',
  },
  providers: [{ provide: F_EXTERNAL_ITEM, useExisting: FExternalItem }],
})
export class FExternalItem<TData> extends FExternalItemBase<TData> implements OnInit, OnDestroy {
  private readonly _apiService = inject(FExternalItemService);

  /** Stable id for matching drag sessions, lookups, etc. */
  public readonly externalItemId = input<string>(`f-external-item-${uniqueId++}`, {
    alias: 'fExternalItemId',
  });

  /** Payload attached to external item. */
  public readonly data = input<TData | undefined>(undefined, {
    alias: 'fData',
  });

  /** Disables dragging/interaction. */
  public readonly disabled = input<boolean, unknown>(false, {
    alias: 'fDisabled',
    transform: booleanAttribute,
  });

  /** Template shown while item is dragged (preview). */
  public readonly preview = model<TemplateRef<unknown> | undefined>(undefined, {
    alias: 'fPreview',
  });

  /** Whether preview should match original element size. */
  public readonly previewMatchSize = input<boolean, unknown>(true, {
    alias: 'fPreviewMatchSize',
    transform: booleanAttribute,
  });

  /** Placeholder template that stays in original place while dragging. */
  public readonly placeholder = model<TemplateRef<unknown> | undefined>(undefined, {
    alias: 'fPlaceholder',
  });

  public ngOnInit(): void {
    this._apiService.register(this);
    this._disablePointerEvents(Array.from(this.hostElement.children) as HTMLElement[]);
  }

  private _disablePointerEvents(children: HTMLElement[]): void {
    children.forEach((x) => {
      x.style.pointerEvents = 'none';
      this._disablePointerEvents(Array.from(x.children) as HTMLElement[]);
    });
  }

  public ngOnDestroy(): void {
    this._apiService.register(this);
  }
}
