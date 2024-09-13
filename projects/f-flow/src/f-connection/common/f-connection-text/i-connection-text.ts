import { IHasHostElement } from '@foblex/core';
import { ILine } from '@foblex/2d';
import { InjectionToken } from '@angular/core';

export const CONNECTION_TEXT = new InjectionToken<IConnectionText>('CONNECTION_TEXT');

export interface IConnectionText extends IHasHostElement {

  redraw(line: ILine): void;
}
