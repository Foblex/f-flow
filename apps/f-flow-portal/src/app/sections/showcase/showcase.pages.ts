import { IPageDefinition } from '@foblex/m-render';

/**
 * One entry per page in the /showcase section.
 *
 * Adding or renaming a page = editing this list, nothing else.
 * SEO, sidebar entry and (when applicable) lazy-loaded components
 * all live here together.
 */
export const SHOWCASE_PAGES: IPageDefinition[] = [
  {
    slug: 'overview',
    text: 'Overview',
    hideFromNavigation: true,
    seo: {
      title: 'Built with Foblex Flow — Angular Apps and Products in Production',
      description:
        'Real products shipping with Foblex Flow: contact-center platforms, AI agent orchestration, low-code tools, and developer utilities.',
    },
  },
];
