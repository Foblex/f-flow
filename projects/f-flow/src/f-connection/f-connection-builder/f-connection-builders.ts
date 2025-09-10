import { InjectionToken } from '@angular/core';
import { IFConnectionBuilder } from './i-f-connection-builder';

export const F_CONNECTION_BUILDERS = new InjectionToken<IFConnectionBuilders>('F_CONNECTION_BUILDERS');

export type IFConnectionBuilders = Record<string, IFConnectionBuilder>;
