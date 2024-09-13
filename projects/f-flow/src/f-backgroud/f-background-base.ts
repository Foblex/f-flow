import { Directive, InjectionToken } from '@angular/core';
import { IHasHostElement } from '@foblex/core';
import { ITransformModel } from '@foblex/2d';

export const F_BACKGROUND = new InjectionToken<FBackgroundBase>('F_BACKGROUND');

@Directive()
export abstract class FBackgroundBase implements IHasHostElement {

  public abstract hostElement: HTMLElement;

  public abstract isBackgroundElement(element: HTMLElement | SVGElement): boolean;

  public abstract setTransform(transform: ITransformModel): void;
}
