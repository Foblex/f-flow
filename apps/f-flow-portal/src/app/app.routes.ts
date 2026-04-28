import { Routes } from '@angular/router';
import { provideDocumentation } from '@foblex/m-render';
import { DOCUMENTATION_CONFIGURATION } from './sections/docs';
import { EXAMPLES_CONFIGURATION } from './sections/examples';
import { SHOWCASE_CONFIGURATION } from './sections/showcase';
import { BLOG_CONFIGURATION } from './sections/blog';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then((m) => m.Services),
  },
  {
    path: 'docs',
    pathMatch: 'full',
    redirectTo: 'docs/intro',
  },
  {
    path: 'docs/en',
    pathMatch: 'full',
    redirectTo: 'docs/intro',
  },
  {
    path: 'docs/en/:slug',
    pathMatch: 'full',
    redirectTo: 'docs/:slug',
  },
  {
    path: 'docs',
    loadChildren: () =>
      import('@foblex/m-render').then((m) =>
        m.DOCUMENTATION_ROUTES.map((route) => ({
          ...route,
          providers: [provideDocumentation(DOCUMENTATION_CONFIGURATION)],
        })),
      ),
  },
  {
    path: 'examples',
    pathMatch: 'full',
    redirectTo: 'examples/overview',
  },
  {
    path: 'examples',
    loadChildren: () =>
      import('@foblex/m-render').then((m) =>
        m.DOCUMENTATION_ROUTES.map((route) => ({
          ...route,
          providers: [provideDocumentation(EXAMPLES_CONFIGURATION)],
        })),
      ),
  },
  {
    path: 'showcase',
    pathMatch: 'full',
    redirectTo: 'showcase/overview',
  },
  {
    path: 'showcase',
    loadChildren: () =>
      import('@foblex/m-render').then((m) =>
        m.DOCUMENTATION_ROUTES.map((route) => ({
          ...route,
          providers: [provideDocumentation(SHOWCASE_CONFIGURATION)],
        })),
      ),
  },
  {
    path: 'blog',
    pathMatch: 'full',
    redirectTo: 'blog/overview',
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('@foblex/m-render').then((m) =>
        m.DOCUMENTATION_ROUTES.map((route) => ({
          ...route,
          providers: [provideDocumentation(BLOG_CONFIGURATION)],
        })),
      ),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
