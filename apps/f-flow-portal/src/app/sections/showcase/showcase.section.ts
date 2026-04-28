import { buildDocumentationConfiguration, ISectionConfig } from '@foblex/m-render';
import { SHOWCASE } from '../../../../public/showcase/showcase';
import { PORTAL_SHELL } from '../../portal-shell';
import { SHOWCASE_PAGES } from './showcase.pages';

const SHOWCASE_SECTION: ISectionConfig = {
  id: 'showcase',
  routePath: '/showcase',
  docsDir: './markdown/showcase/',
  tableOfContent: null,
  pages: SHOWCASE_PAGES,
  showcaseItems: SHOWCASE,
  keywords:
    'foblex flow showcase, angular workflow builder showcase, angular diagram showcase, node editor case studies',
};

export const SHOWCASE_CONFIGURATION = buildDocumentationConfiguration(
  PORTAL_SHELL,
  SHOWCASE_SECTION,
);
