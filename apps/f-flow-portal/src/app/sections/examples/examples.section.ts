import { buildDocumentationConfiguration, ISectionConfig } from '@foblex/m-render';
import { PORTAL_SHELL } from '../../portal-shell';
import { EXAMPLES_COMPONENTS, EXAMPLES_PAGES } from './examples.pages';

const EXAMPLES_SECTION: ISectionConfig = {
  id: 'examples',
  routePath: '/examples',
  docsDir: './markdown/examples/',
  appendAppNameToTitle: true,
  tableOfContent: {
    title: 'In this article',
    range: { start: 2, end: 6 },
  },
  pages: EXAMPLES_PAGES,
  components: EXAMPLES_COMPONENTS,
  footer: {
    navigation: {
      editLink: {
        pattern:
          'https://github.com/foblex/f-flow/edit/main/apps/f-flow-portal/public/markdown/examples/',
        text: 'Edit this page on GitHub',
      },
      previous: 'Previous Page',
      next: 'Next Page',
    },
  },
  keywords:
    'foblex flow examples, angular node editor examples, angular workflow builder examples, angular diagram examples, graph ui angular demos',
};

export const EXAMPLES_CONFIGURATION = buildDocumentationConfiguration(
  PORTAL_SHELL,
  EXAMPLES_SECTION,
);
