import {
  provideBackground, provideHeader, provideHeaderSearch,
  provideHero,
  provideHomeButtons,
  provideHomeFeatures,
  provideHomeFooter, provideImage,
  provideLogo,
  provideTitle,
} from '@foblex/m-render';
import {HomePageImageComponent} from "./home-page/home-page-image/home-page-image.component";
import {HomePageBackgroundComponent} from "./home-page/home-page-background/home-page-background.component";

export const HOME_CONFIGURATION = {
  providers: [
    provideLogo('./logo.svg'),
    provideTitle('Foblex Flow'),
    provideHero({
      headline: 'Foblex Flow',
      tagline1: 'Built with Angular',
      tagline2: 'Flow-Chart Library',
      subDescription: 'Supports Angular 12+, SSR, and Composition API.',
    }),
    provideBackground(HomePageBackgroundComponent),
    provideImage(HomePageImageComponent),
    provideHomeButtons([{
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
      text: 'Showcase',
      routerLink: '/showcase/overview',
    }, {
      icon: 'heart',
      text: 'Support Us',
      href: 'https://www.paypal.com/donate/?hosted_button_id=VXXQ5SRMEU256',
    }]),
    provideHomeFeatures([{
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
    }]),
    provideHomeFooter({
      text: 'MIT License | Copyright © 2022 - Present',
    }),
  ],
};
