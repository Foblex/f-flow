import {
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  ModelSignal,
  Signal,
  TemplateRef,
} from '@angular/core';

export const F_EXTERNAL_ITEM = new InjectionToken<FExternalItemBase>('F_EXTERNAL_ITEM');

@Directive()
export abstract class FExternalItemBase<TData = never> {
  public readonly hostElement = inject(ElementRef).nativeElement;

  public abstract externalItemId: Signal<string>;
  public abstract data: Signal<TData | undefined>;
  public abstract disabled: Signal<boolean>;
  public abstract preview: ModelSignal<TemplateRef<unknown> | undefined>;
  public abstract previewMatchSize: Signal<boolean>;
  public abstract placeholder: ModelSignal<TemplateRef<unknown> | undefined>;
}
