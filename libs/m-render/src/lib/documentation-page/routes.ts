import { Routes } from '@angular/router';

export const DOCUMENTATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./index').then(m => m.Documentation),
    children: [
      {
        path: '**',
        loadComponent: () => import('./components/markdown-router').then(m => m.MarkdownRouter),
      },
    ],
  },
];
