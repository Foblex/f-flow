import { ITransformModel } from '@foblex/core';
import { InjectionToken } from '@angular/core';

export const F_BACKGROUND_PATTERN = new InjectionToken<IFBackgroundPattern>('F_BACKGROUND_PATTERN');

export interface IFBackgroundPattern {

  setTransform(transform: ITransformModel): void;
}
