import {
  provideBackground,
  provideHero,
  provideHomeButtons,
  provideHomeFeatures,
  provideHomeFooter,
  provideImage,
  provideLogo,
  provideTitle,
} from '@foblex/m-render';
import { HomePageImageComponent } from './home-page/home-page-image/home-page-image.component';
import { HomePageBackgroundComponent } from './home-page/home-page-background/home-page-background.component';

export const HOME_CONFIGURATION = {
  providers: [
    provideLogo('./logo.svg'),
    provideTitle('Foblex Flow'),
    provideHero({
      headline: 'Foblex Flow',
      tagline1: 'Angular-Native',
      tagline2: 'Node-Based UI Library',
      subDescription:
        'Build node editors, workflow builders, and interactive graph interfaces with SSR-friendly Angular APIs.',
    }),
    provideBackground(HomePageBackgroundComponent),
    provideImage(HomePageImageComponent),
    provideHomeButtons([
      {
        primary: true,
        text: 'Get Started',
        routerLink: '/docs/get-started',
      },
      {
        text: 'Examples',
        routerLink: '/examples/overview',
      },
      {
        text: 'GitHub',
        href: 'https://github.com/Foblex/f-flow',
      },
      {
        text: 'Showcase',
        routerLink: '/showcase/overview',
      },
    ]),
    provideHomeFeatures([
      {
        headline: 'Angular-First Architecture',
        description:
          'Foblex Flow fits Angular apps instead of forcing a React-style data model. Use standalone components, SSR, signals-friendly patterns, and your own application state.',
      },
      {
        headline: 'Built For Real Editors',
        description:
          'Build workflow builders, call-flow editors, AI pipeline tools, internal back-office UIs, UML diagrams, and custom graph interfaces with the same Angular-first primitives.',
      },
      {
        headline: 'Production Interaction Layer',
        description:
          'Handle dragging, connect/reassign flows, selection, minimap, zoom, snapping, waypoints, and alignment helpers without rebuilding low-level interaction logic from scratch.',
      },
      {
        headline: 'Validated On Real Products',
        description:
          'Review the open-source AI Low-Code Platform reference and the Showcase collection of production products before you commit Foblex Flow to your Angular stack.',
      },
    ]),
    provideHomeFooter({
      text: 'MIT License | Copyright © 2022 - Present',
    }),
  ],
};
