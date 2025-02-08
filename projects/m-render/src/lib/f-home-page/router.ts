import { Routes } from '@angular/router';

export const F_HOME_PAGE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./index').then(m => m.FHomePageComponent),
  }
];
