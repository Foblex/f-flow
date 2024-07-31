import { Routes } from '@angular/router';
import { ENGLISH_ENVIRONMENT } from '../../public/docs/en/environment';
import { F_ENVIRONMENT } from '@foblex/f-docs';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'docs',
    providers: [
      { provide: F_ENVIRONMENT, useValue: ENGLISH_ENVIRONMENT }
    ],
    loadChildren: () => import('@foblex/f-docs').then(m => m.F_DOCUMENTATION_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/docs/get-started',
  }
];
