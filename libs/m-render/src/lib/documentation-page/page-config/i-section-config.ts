import { ITableOfContent } from '../components';
import { IShowcaseItem, IDynamicComponentItem } from '../../dynamic-components';
import { IDocumentationFooterConfiguration } from '../domain';
import { IPageDefinition } from './i-page-definition';

/**
 * Self-contained description of a documentation section
 * (docs / examples / blog / showcase / ...).
 *
 * The section owns its pages; the portal shell (IPortalShellConfig) owns
 * everything that is shared across sections (header, media links, default SEO).
 */
export interface ISectionConfig {
  /** Stable identifier of the section, e.g. 'showcase' */
  id: string;

  /** Route prefix matching app.routes.ts, e.g. '/showcase'. Used to build canonical URLs. */
  routePath: string;

  /** Markdown directory served from /public, e.g. './markdown/showcase/' */
  docsDir: string;

  tableOfContent: ITableOfContent | null;

  pages: IPageDefinition[];

  /** Slug of the page whose SEO is used as the section-level default. Defaults to 'overview'. */
  overviewSlug?: string;

  /** Section-wide keywords applied to the section's default <meta name="keywords">. */
  keywords?: string;

  /**
   * If true, the meta service appends " | <appName>" to every page's <title>.
   *
   * Use for sections like docs/examples where pageTitle is a long descriptive
   * phrase that should be branded. Default: false (page seo.title is final).
   * Per-page exceptions: set IPageSeo.titleIsFinal.
   */
  appendAppNameToTitle?: boolean;

  /** Section-specific extras passed through to the underlying configuration. */
  showcaseItems?: IShowcaseItem[];

  blogNavigation?: boolean;

  footer?: IDocumentationFooterConfiguration;

  /**
   * Section-wide dynamic components.
   *
   * Use only as an escape hatch when a component is shared across pages
   * and no single page "owns" it. Otherwise prefer per-page `components`
   * on IPageDefinition so registration lives next to the page that uses it.
   */
  components?: IDynamicComponentItem[];
}
