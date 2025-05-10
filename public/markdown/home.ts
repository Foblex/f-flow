import { IHomePageEnvironment } from '@foblex/m-render';
import {
  HomePageBackgroundComponent
} from '../../src/app/home-page/home-page-background/home-page-background.component';
import { HomePageImageComponent } from '../../src/app/home-page/home-page-image/home-page-image.component';

export const HOME_ENVIRONMENT: IHomePageEnvironment = {
  logo: './logo.svg',
  title: 'Foblex Flow',
  backgroundComponent: HomePageBackgroundComponent,
  heroImageComponent: HomePageImageComponent,
  hero: {
    headline: 'Foblex Flow',
    tagline1: 'Built with Angular',
    tagline2: 'Flow-Chart Library',
    subDescription: 'Supports Angular 12+, SSR, and Composition API.',
  },
  buttons: [{
    primary: true,
    text: 'Get Started',
    routerLink: '/docs/get-started',
  }, {
    text: 'Examples',
    routerLink: '/examples/overview',
  }, {
    text: 'GitHub',
    href: 'https://github.com/Foblex/f-flow',
  }, {
    icon: 'heart',
    text: 'Support Us',
    routerLink: '/membership',
  }],
  features: [{
    headline: 'Easy to Use',
    description: 'Create sophisticated diagrams effortlessly with a straightforward and intuitive API. Whether you’re a beginner or a pro, a few lines of code are all you need to get started.',
  }, {
    headline: 'Customizable',
    description: 'Build with total flexibility in mind. Foblex Flow allows you to easily integrate any content within nodes, providing full control over the look and feel, ensuring it adapts perfectly to your project’s needs.',
  }, {
    headline: 'Visualization',
    description: 'Transform complex data into clear, visual representations. Foblex Flow turns information into intuitive diagrams, helping users rapidly understand, analyze, and navigate intricate relationships.',
  }, {
    headline: 'Interactive',
    description: 'Foblex Flow takes interactivity to the next level. With fluid drag-and-drop node movement, seamless connection creation, and smooth zooming, exploring your diagrams is an effortless, enjoyable experience.',
  }],
  footer: {
    text: 'MIT License | Copyright © 2022 - Present',
  }
}

