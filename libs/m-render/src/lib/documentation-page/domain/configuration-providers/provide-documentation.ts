import { IDocumentationConfiguration } from '../i-documentation-configuration';
import { InjectionToken, Provider } from '@angular/core';

export function provideDocumentation(configuration: IDocumentationConfiguration): Provider {
  return { provide: DOCUMENTATION_CONFIGURATION, useValue: configuration };
}

export const DOCUMENTATION_CONFIGURATION = new InjectionToken<IDocumentationConfiguration>('DOCUMENTATION_CONFIGURATION');
