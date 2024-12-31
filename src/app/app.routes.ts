import { Routes } from '@angular/router';
import { GUIDES_ENVIRONMENT } from '../../public/markdown/guides/environment';
import { EXAMPLES_ENVIRONMENT } from '../../public/markdown/examples/environment';
import { F_ENVIRONMENT } from '@foblex/m-render';

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
    loadChildren: () => import('@foblex/m-render').then(m => m.F_DOCUMENTATION_ROUTES)
  },
  {
    path: 'examples',
    providers: [
      { provide: F_ENVIRONMENT, useValue: EXAMPLES_ENVIRONMENT }
    ],
    loadChildren: () => import('@foblex/m-render').then(m => m.F_DOCUMENTATION_ROUTES)
  },
  {
    path: '**',
    loadComponent: () => import('./not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent),
  }
];
