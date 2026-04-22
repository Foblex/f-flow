import { InjectionToken } from '@angular/core';

export interface IToggleNavigationComponent {

  onToggleNavigation(value: boolean): void;
}

export const TOGGLE_NAVIGATION_COMPONENT = new InjectionToken<IToggleNavigationComponent>('TOGGLE_NAVIGATION_COMPONENT');
