import {Routes} from '@angular/router';
import {provideDocumentation, provideHomePage} from "@foblex/m-render";
import {HOME_CONFIGURATION} from "./home.config";
import {DOCUMENTATION_CONFIGURATION} from "./documentation.config";
import {EXAMPLES_CONFIGURATION} from "./examples.config";

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
    path: '**',
    loadComponent: () => import('./not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent),
  }
];
