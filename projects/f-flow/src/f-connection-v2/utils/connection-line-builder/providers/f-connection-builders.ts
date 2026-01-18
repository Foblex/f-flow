import { InjectionToken } from '@angular/core';
import { IFConnectionBuilder } from '../models';

export type IConnectionBuilders = Record<string, IFConnectionBuilder>;

export const F_CONNECTION_BUILDERS = new InjectionToken<IConnectionBuilders>(
  'F_CONNECTION_BUILDERS',
);
