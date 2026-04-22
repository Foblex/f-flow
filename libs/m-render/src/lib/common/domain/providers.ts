import { InjectionToken } from '@angular/core';
import { IHeaderConfiguration } from './configuration-providers';

export const HEADER_CONFIGURATION_PROVIDER = new InjectionToken<IHeaderConfiguration>('HEADER_CONFIGURATION_PROVIDER');

export interface IHeaderConfigurationStore {
  getHeader(): IHeaderConfiguration | undefined;
}
