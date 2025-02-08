import { Routes } from '@angular/router';

export const F_DOCS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./index').then(m => m.FDocumentationComponent),
    children: [
      {
        path: '**',
        loadComponent: () => import('./f-page').then(m => m.FPageComponent)
      }
    ]
  }
];
