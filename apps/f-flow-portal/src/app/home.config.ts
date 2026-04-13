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
import { HeroFlow } from './home-page/home-page-flow/hero-flow';

export const HOME_CONFIGURATION = {
  providers: [
    provideLogo('./logo.svg'),
    provideTitle('Foblex Flow'),
    provideHero({
      headline: 'Foblex Flow',
      tagline1: 'Angular-Native',
      tagline2: 'Node-Based UI Library',
      subDescription:
        'Start with a simple Angular node editor in minutes. Add selection, minimap, snapping, caching, and virtualization only when you need them.',
    }),
    provideBackground(HeroFlow),
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
        headline: 'Simple Angular Start',
        description:
          'Most teams start with `f-flow`, `f-canvas`, nodes, and connections. Use your own Angular templates, forms, validators, and state without adopting a React-style mental model.',
      },
      {
        headline: 'Scale When Needed',
        description:
          'Advanced helpers are optional. Add selection, minimap, alignment, waypoints, caching, or virtualization later if your editor grows in complexity or size.',
      },
      {
        headline: 'Built For Real Editors',
        description:
          'Build workflow builders, call-flow editors, AI pipeline tools, internal back-office UIs, UML diagrams, and custom graph interfaces with the same Angular-first primitives.',
      },
      {
        headline: 'Validated On Real Products',
        description:
          'Review the open-source AI Low-Code Platform reference app and the Showcase collection of production products before you commit Foblex Flow to your Angular stack.',
      },
    ]),
    provideHomeFooter({
      text: 'MIT License | Copyright © 2022 - Present',
    }),
  ],
};
