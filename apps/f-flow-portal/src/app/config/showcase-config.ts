import { IDocumentationConfiguration } from '@foblex/m-render';
import { SHOWCASE } from '../../../public/showcase/showcase';
import { PORTAL_APP_NAME, PORTAL_LANGUAGE, PORTAL_LOGO } from './portal-config';

/* eslint-disable @typescript-eslint/naming-convention */
export const SHOWCASE_CONFIGURATION: IDocumentationConfiguration = {
  lang: PORTAL_LANGUAGE,
  docsDir: './markdown/showcase/',
  notFoundMarkdown: './markdown/404.md',
  logo: PORTAL_LOGO,
  title: PORTAL_APP_NAME,
  navigation: [],
  tableOfContent: null,
  showcaseItems: SHOWCASE,
  header: {
    navigation: [
      { link: '/docs/get-started', active: '/docs', text: 'Docs' },
      { link: '/examples/overview', active: '/examples', text: 'Examples' },
      { link: '/showcase/overview', active: '/showcase', text: 'Showcase' },
      { link: '/blog/overview', active: '/blog', text: 'Articles' },
      { link: '/services', active: '/services', text: 'Services' },
    ],
    mediaLinks: [
      { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
      { icon: 'twitter', link: 'https://x.com/foblexflow' },
    ],
  },
  meta: {
    url: 'https://flow.foblex.com/showcase/overview',
    type: 'website',
    canonical: 'https://flow.foblex.com/showcase/overview',
    title: 'Built with Foblex Flow — Angular Apps and Products in Production',
    app_name: PORTAL_APP_NAME,
    locale: 'en_US',
    description:
      'Real products shipping with Foblex Flow: contact-center platforms, AI agent orchestration, low-code tools, and developer utilities.',
    image: 'https://flow.foblex.com/site-preview.png',
    image_type: 'image/png',
    image_width: 1688,
    image_height: 937,
    keywords:
      'foblex flow showcase, angular workflow builder showcase, angular diagram showcase, node editor case studies',
    robots: 'index, follow, max-image-preview:large',
    twitter_card: 'summary_large_image',
    twitter_site: '@foblexflow',
    twitter_creator: '@foblexflow',
  },
};
