import { InjectionToken } from '@angular/core';

export const F_DOCUMENTATION_COMPONENT: InjectionToken<IDocumentationComponent> = new InjectionToken<IDocumentationComponent>('F_DOCUMENTATION_COMPONENT');

export interface IDocumentationComponent {

  onToggleNavigation(value: boolean): void;
}
