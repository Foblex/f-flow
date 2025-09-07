import {Routes} from '@angular/router';
import {provideDocumentation, provideHomePage} from "@foblex/m-render";
import {HOME_CONFIGURATION} from "./home.config";
import {DOCUMENTATION_CONFIGURATION} from "./documentation.config";
import {EXAMPLES_CONFIGURATION} from "./examples.config";
import {SHOWCASE_CONFIGURATION} from "./showcase.config";

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@foblex/m-render').then((m) => m.HOME_ROUTES.map((route) => ({
        ...route,
        providers: [
          provideHomePage(
            HOME_CONFIGURATION,
          ),
        ],
      }))),
  },
  {
    path: 'docs',
    pathMatch: 'full',
    redirectTo: 'docs/intro'
  },
  {
    path: 'docs',
    loadChildren: () => import('@foblex/m-render').then((m) => m.DOCUMENTATION_ROUTES.map((route) => ({
      ...route,
      providers: [
        provideDocumentation(
          DOCUMENTATION_CONFIGURATION,
        ),
      ],
    }))),
  },
  {
    path: 'examples',
    pathMatch: 'full',
    redirectTo: 'examples/overview'
  },
  {
    path: 'examples',
    loadChildren: () => import('@foblex/m-render').then((m) => m.DOCUMENTATION_ROUTES.map((route) => ({
      ...route,
      providers: [
        provideDocumentation(
          EXAMPLES_CONFIGURATION,
        ),
      ],
    }))),
  },
  {
    path: 'showcase',
    pathMatch: 'full',
    redirectTo: 'showcase/overview'
  },
  {
    path: 'showcase',
    loadChildren: () => import('@foblex/m-render').then((m) => m.DOCUMENTATION_ROUTES.map((route) => ({
      ...route,
      providers: [
        provideDocumentation(
          SHOWCASE_CONFIGURATION,
        ),
      ],
    }))),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent),
  }
];
