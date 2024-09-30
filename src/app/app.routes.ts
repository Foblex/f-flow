import { Routes } from '@angular/router';
import { F_ENVIRONMENT } from '@foblex/f-docs';
import { GUIDES_ENVIRONMENT } from '../../public/docs/en/guides/environment';
import { EXAMPLES_ENVIRONMENT } from '../../public/docs/en/examples/environment';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'docs',
    providers: [
      { provide: F_ENVIRONMENT, useValue: GUIDES_ENVIRONMENT }
    ],
    loadChildren: () => import('@foblex/f-docs').then(m => m.F_DOCUMENTATION_ROUTES)
  },
  {
    path: 'examples',
    providers: [
      { provide: F_ENVIRONMENT, useValue: EXAMPLES_ENVIRONMENT }
    ],
    loadChildren: () => import('@foblex/f-docs').then(m => m.F_DOCUMENTATION_ROUTES)
  },
  {
    path: '**',
    loadComponent: () => import('./not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent),
  }
];
