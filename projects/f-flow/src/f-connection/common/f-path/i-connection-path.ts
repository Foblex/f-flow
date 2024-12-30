import { InjectionToken } from '@angular/core';
import { IHasHostElement } from '../../../i-has-host-element';

export const CONNECTION_PATH = new InjectionToken<IConnectionPath>('CONNECTION_PATH');

export interface IConnectionPath extends IHasHostElement<SVGPathElement> {

  initialize(): void;

  setPath(path: string): void;

  select(): void;

  deselect(): void;
}
