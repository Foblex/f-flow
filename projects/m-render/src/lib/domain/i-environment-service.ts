import { InjectionToken } from '@angular/core';

export const INTERNAL_ENVIRONMENT_SERVICE = new InjectionToken<IEnvironmentService>('INTERNAL_ENVIRONMENT_SERVICE');

export interface IEnvironmentService {

  getLogo(): string;

  getTitle(): string;
}
