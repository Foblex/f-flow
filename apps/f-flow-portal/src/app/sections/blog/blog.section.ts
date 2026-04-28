import { buildDocumentationConfiguration, ISectionConfig } from '@foblex/m-render';
import { PORTAL_SHELL } from '../../portal-shell';
import { BLOG_COMPONENTS, BLOG_PAGES } from './blog.pages';

const BLOG_SECTION: ISectionConfig = {
  id: 'blog',
  routePath: '/blog',
  docsDir: './markdown/blog/',
  tableOfContent: {
    title: 'In this article',
    range: { start: 2, end: 4 },
  },
  pages: BLOG_PAGES,
  components: BLOG_COMPONENTS,
  footer: {
    navigation: {
      previous: 'Previous Post',
      next: 'Next Post',
    },
  },
  keywords:
    'foblex flow articles, angular node editor articles, angular workflow builder tutorials, node based ui engineering, foblex flow releases',
};

export const BLOG_CONFIGURATION = buildDocumentationConfiguration(PORTAL_SHELL, BLOG_SECTION);
