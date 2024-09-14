import { ILine } from '@foblex/2d';
import { InjectionToken } from '@angular/core';
import { IHasHostElement } from '../../../i-has-host-element';

export const CONNECTION_TEXT = new InjectionToken<IConnectionText>('CONNECTION_TEXT');

export interface IConnectionText extends IHasHostElement {

  redraw(line: ILine): void;
}
