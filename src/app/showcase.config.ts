import {
  provide404Markdown,
  provideDirectory,
  provideMeta,
  provideHeader,
  provideHeaderMediaLinks,
  provideHeaderNavigation,
  provideLanguage,
  provideLogo,
  provideTitle,
  provideNavigation,
  provideShowcase,
} from '@foblex/m-render';
import { SHOWCASE } from '../../public/showcase/showcase';

export const SHOWCASE_CONFIGURATION = {
  providers: [
    provideLanguage('en'),
    provideDirectory('./markdown/showcase/'),
    provide404Markdown('./markdown/404.md'),
    provideLogo('./logo.svg'),
    provideTitle('Foblex Flow'),
    provideNavigation(),
    provideHeader(
      provideHeaderNavigation([
        {
          link: '/docs/get-started',
          active: '/docs',
          text: 'Docs',
        },
        {
          link: '/examples/overview',
          active: '/examples',
          text: 'Examples',
        },
        {
          link: '/showcase/overview',
          active: '/showcase',
          text: 'Showcase',
        },
        {
          link: '/blog/overview',
          active: '/blog',
          text: 'Blog',
        },
      ]),
      provideHeaderMediaLinks([
        { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
        { icon: 'twitter', link: 'https://x.com/foblexflow' },
      ]),
    ),
    provideShowcase(SHOWCASE),
    provideMeta({
      url: 'https://flow.foblex.com/showcase/overview',
      type: 'website',
      canonical: 'https://flow.foblex.com/showcase/overview',
      title: 'Showcase of Projects Built with Foblex Flow | Angular Flow Diagrams',
      app_name: 'Foblex Flow',
      locale: 'en_US',
      description:
        'Discover real-world projects and apps built with Foblex Flow, the Angular flow diagram and node editor library. See how developers and companies use it in production.',
      image: 'https://flow.foblex.com/site-preview.png',
      image_type: 'image/png',
      image_width: 2986,
      image_height: 1926,
      keywords:
        'foblex flow showcase, angular diagram showcase, flowchart projects angular, node editor case studies',
      robots: 'index, follow, max-image-preview:large',
      twitter_card: 'summary_large_image',
      twitter_site: '@foblexflow',
      twitter_creator: '@foblexflow',
    }),
  ],
};
