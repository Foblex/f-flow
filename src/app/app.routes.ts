import { Routes } from '@angular/router';
import { GUIDES_ENVIRONMENT } from '../../public/markdown/guides/environment';
import { EXAMPLES_ENVIRONMENT } from '../../public/markdown/examples/environment';
import { F_DOCS_ENVIRONMENT, F_HOME_PAGE_ENVIRONMENT } from '@foblex/m-render';
import { HOME_ENVIRONMENT } from '../../public/markdown/home';

export const routes: Routes = [
  {
    path: '',
    providers: [
      { provide: F_HOME_PAGE_ENVIRONMENT, useValue: HOME_ENVIRONMENT }
    ],
    loadChildren: () => import('@foblex/m-render').then(m => m.F_HOME_PAGE_ROUTES),
  },
  {
    path: 'docs',
    providers: [
      { provide: F_DOCS_ENVIRONMENT, useValue: GUIDES_ENVIRONMENT }
    ],
    loadChildren: () => import('@foblex/m-render').then(m => m.F_DOCS_ROUTES)
  },
  {
    path: 'examples',
    providers: [
      { provide: F_DOCS_ENVIRONMENT, useValue: EXAMPLES_ENVIRONMENT }
    ],
    loadChildren: () => import('@foblex/m-render').then(m => m.F_DOCS_ROUTES)
  },
  {
    path: '**',
    loadComponent: () => import('./not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent),
  }
];
