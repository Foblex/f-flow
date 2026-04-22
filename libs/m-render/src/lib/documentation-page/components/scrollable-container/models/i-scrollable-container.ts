import { InjectionToken } from '@angular/core';

export const SCROLLABLE_CONTAINER = new InjectionToken<IScrollableContainer>('SCROLLABLE_CONTAINER');

export interface IScrollableContainer {

  htmlElement: HTMLElement & { _ignoreProgrammatic?: boolean };
}


