import { buildDocumentationConfiguration, ISectionConfig } from '@foblex/m-render';
import { PORTAL_SHELL } from '../../portal-shell';
import { DOCS_COMPONENTS, DOCS_PAGES } from './docs.pages';

const DOCS_SECTION: ISectionConfig = {
  id: 'docs',
  routePath: '/docs',
  docsDir: './markdown/guides/',
  // Default behavior for the section: append " | Foblex Flow" to each page
  // <title>. Per-page exceptions opt out via IPageSeo.titleIsFinal.
  appendAppNameToTitle: true,
  // Section meta uses 'intro' as the source of <meta>/OG defaults to match
  // the prior behavior where /docs redirects to /docs/intro.
  overviewSlug: 'intro',
  tableOfContent: {
    title: 'In this article',
    range: { start: 2, end: 6 },
  },
  pages: DOCS_PAGES,
  components: DOCS_COMPONENTS,
  footer: {
    navigation: {
      editLink: {
        pattern:
          'https://github.com/foblex/f-flow/edit/main/apps/f-flow-portal/public/markdown/guides/',
        text: 'Edit this page on GitHub',
      },
      previous: 'Previous Page',
      next: 'Next Page',
    },
  },
  keywords:
    'foblex flow docs, angular node based ui, angular node editor docs, angular workflow builder docs, angular diagram library docs',
};

export const DOCUMENTATION_CONFIGURATION = buildDocumentationConfiguration(
  PORTAL_SHELL,
  DOCS_SECTION,
);
