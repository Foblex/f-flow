import { IHasHostElement } from '@foblex/core';
import { Directive, InjectionToken } from '@angular/core';

export const F_EXTERNAL_ITEM = new InjectionToken<FExternalItemBase>('F_EXTERNAL_ITEM');

@Directive()
export abstract class FExternalItemBase<TData = any> implements IHasHostElement {

  public abstract fExternalItemId: string;

  public abstract hostElement: HTMLElement | SVGElement;

  public abstract fData: TData | undefined;

  public abstract fDisabled: boolean;
}
