import { IHasHostElement, ILine } from '@foblex/core';
import { InjectionToken } from '@angular/core';

export const CONNECTION_GRADIENT = new InjectionToken<IConnectionGradient>('CONNECTION_GRADIENT');

export interface IConnectionGradient extends IHasHostElement {

  initialize(): void;

  redraw(line: ILine): void;
}
