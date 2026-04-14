import { ITransformModel } from '@foblex/2d';
import { InjectionToken } from '@angular/core';

export const F_BACKGROUND_PATTERN = new InjectionToken<IFBackgroundPattern>('F_BACKGROUND_PATTERN');

export interface IFBackgroundPattern {

  hostElement: HTMLElement | SVGElement;

  setTransform(transform: ITransformModel): void;
}
