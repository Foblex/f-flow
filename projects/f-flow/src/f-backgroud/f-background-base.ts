import { Directive, InjectionToken } from '@angular/core';
import { IHasHostElement, ITransformModel } from '@foblex/core';

export const F_BACKGROUND = new InjectionToken<FBackgroundBase>('F_BACKGROUND');

@Directive()
export abstract class FBackgroundBase implements IHasHostElement {

  public abstract hostElement: HTMLElement;

  public abstract isBackgroundElement(element: HTMLElement | SVGElement): boolean;

  public abstract setTransform(transform: ITransformModel): void;
}
