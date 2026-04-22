import { InjectionToken } from '@angular/core';
import { IDynamicComponentItem } from '../models';

export const EXTERNAL_COMPONENT_PROVIDER = new InjectionToken<IDynamicComponentItem[]>('EXTERNAL_COMPONENT_PROVIDER');
