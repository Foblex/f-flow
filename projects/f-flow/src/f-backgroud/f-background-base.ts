import { Directive, InjectionToken } from '@angular/core';
import { ITransformModel } from '@foblex/2d';
import { IHasHostElement } from '../i-has-host-element';

export const F_BACKGROUND = new InjectionToken<FBackgroundBase>('F_BACKGROUND');

@Directive()
export abstract class FBackgroundBase implements IHasHostElement {

  public abstract hostElement: HTMLElement;

  public abstract setTransform(transform: ITransformModel): void;
}
