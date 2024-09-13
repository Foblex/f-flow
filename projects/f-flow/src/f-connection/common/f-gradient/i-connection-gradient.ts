import { IHasHostElement } from '@foblex/core';
import { ILine } from '@foblex/2d';
import { InjectionToken } from '@angular/core';

export const CONNECTION_GRADIENT = new InjectionToken<IConnectionGradient>('CONNECTION_GRADIENT');

export interface IConnectionGradient extends IHasHostElement {

  initialize(): void;

  redraw(line: ILine): void;
}
