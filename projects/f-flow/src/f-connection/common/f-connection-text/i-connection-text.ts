import { IHasHostElement, IVector } from '@foblex/core';
import { InjectionToken } from '@angular/core';

export const CONNECTION_TEXT = new InjectionToken<IConnectionText>('CONNECTION_TEXT');

export interface IConnectionText extends IHasHostElement {

  redraw(vector: IVector): void;
}
