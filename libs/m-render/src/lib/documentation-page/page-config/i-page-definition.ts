import { INavigationItemBadge } from '../components';
import { IDynamicComponentItem } from '../../dynamic-components';
import { IPageSeo } from './i-page-seo';

/**
 * Single source of truth for one page in a documentation section.
 *
 * Combines data that previously lived in three separate places:
 *   - INavigationItem        (sidebar entry, page-level SEO overrides)
 *   - markdown frontmatter   (duplicated SEO fields)
 *   - section components[]   (lazy components used by the page)
 */
export interface IPageDefinition {
  /** URL slug within the section, e.g. 'overview' -> /<section>/overview */
  slug: string;

  /** Sidebar / navigation label */
  text: string;

  /** Sidebar group title; pages with the same group end up in one INavigationGroup */
  group?: string;

  /** Exclude from sidebar (still routable; useful for landing pages) */
  hideFromNavigation?: boolean;

  seo: IPageSeo;

  hideToc?: boolean;

  badge?: INavigationItemBadge;

  date?: Date;

  /** Lazy components used by this page; collected into the section's components[] */
  components?: IDynamicComponentItem[];
}
