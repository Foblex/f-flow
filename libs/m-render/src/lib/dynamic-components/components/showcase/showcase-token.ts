import { IShowcaseItem } from './models';
import { InjectionToken } from '@angular/core';

export const SHOWCASE_DATA = new InjectionToken<IShowcaseItem[]>('SHOWCASE_DATA');

