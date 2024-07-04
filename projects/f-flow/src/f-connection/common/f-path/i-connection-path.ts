import { IHasHostElement } from '@foblex/core';
import { InjectionToken } from '@angular/core';

export const CONNECTION_PATH = new InjectionToken<IConnectionPath>('CONNECTION_PATH');

export interface IConnectionPath extends IHasHostElement {

  initialize(): void;

  setPath(path: string): void;

  select(): void;

  deselect(): void;
}
