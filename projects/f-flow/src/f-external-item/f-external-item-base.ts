import { Directive, TemplateRef } from '@angular/core';
import { IHasHostElement } from '../i-has-host-element';

@Directive()
export abstract class FExternalItemBase<TData = unknown> implements IHasHostElement {
  public abstract fExternalItemId: string;

  public abstract hostElement: HTMLElement | SVGElement;

  public abstract fData: TData | undefined;

  public abstract fDisabled: boolean;

  public abstract fPreview: TemplateRef<unknown> | undefined;

  public abstract fPreviewMatchSize: boolean;

  public abstract fPlaceholder: TemplateRef<unknown> | undefined;
}
