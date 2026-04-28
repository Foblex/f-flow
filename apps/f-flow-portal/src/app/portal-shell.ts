import { IPortalShellConfig } from '@foblex/m-render';

/**
 * Portal-wide shell config. Single source of truth for everything
 * that is identical across documentation sections (docs / examples /
 * showcase / blog) — header navigation, media links, default SEO.
 *
 * Per-section data lives in apps/f-flow-portal/src/app/sections/<section>.
 */
export const PORTAL_SHELL: IPortalShellConfig = {
  appName: 'Foblex Flow',
  language: 'en',
  logo: './logo.svg',
  origin: 'https://flow.foblex.com',
  notFoundMarkdown: './markdown/404.md',
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
  defaultSeo: {
    locale: 'en_US',
    image: 'https://flow.foblex.com/site-preview.png',
    imageType: 'image/png',
    imageWidth: 1688,
    imageHeight: 937,
    twitterCard: 'summary_large_image',
    twitterSite: '@foblexflow',
    twitterCreator: '@foblexflow',
    robots: 'index, follow, max-image-preview:large',
  },
};
