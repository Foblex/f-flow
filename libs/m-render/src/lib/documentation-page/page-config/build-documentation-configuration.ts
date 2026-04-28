/* eslint-disable @typescript-eslint/naming-convention */
import { IDocumentationConfiguration } from '../domain';
import { INavigationGroup, INavigationItem } from '../components';
import { IDynamicComponentItem } from '../../dynamic-components';
import { IMetaData } from '../analytics';
import { IPortalShellConfig } from './i-portal-shell-config';
import { ISectionConfig } from './i-section-config';
import { IPageDefinition } from './i-page-definition';
import { derivePageMarkdownPath } from './derive-markdown-path';

/**
 * Build the runtime IDocumentationConfiguration from a portal shell + section.
 *
 * This is the single point that fans page-level data out into:
 *   - the navigation tree consumed by the sidebar/meta service
 *   - the dynamic-components registry consumed by markdown rendering
 *   - the section-level <meta>/OG defaults consumed when the route activates
 */
export function buildDocumentationConfiguration(
  shell: IPortalShellConfig,
  section: ISectionConfig,
): IDocumentationConfiguration {
  return {
    lang: shell.language,
    title: shell.appName,
    logo: shell.logo,
    docsDir: section.docsDir,
    notFoundMarkdown: shell.notFoundMarkdown,
    navigation: buildNavigation(section),
    components: buildComponents(section),
    tableOfContent: section.tableOfContent,
    showcaseItems: section.showcaseItems,
    blogNavigation: section.blogNavigation,
    footer: section.footer,
    header: {
      navigation: shell.header.navigation,
      mediaLinks: shell.header.mediaLinks,
      search: shell.header.search,
    },
    meta: buildSectionMeta(shell, section),
    markdownPaths: buildMarkdownPaths(section),
  };
}

function buildMarkdownPaths(section: ISectionConfig): Record<string, string> {
  const paths: Record<string, string> = {};
  for (const page of section.pages) {
    const path = derivePageMarkdownPath(page);
    if (path) {
      paths[page.slug] = path;
    }
  }

  return paths;
}

function buildNavigation(section: ISectionConfig): INavigationGroup[] {
  const buckets = new Map<string, INavigationItem[]>();
  const order: string[] = [];

  for (const page of section.pages) {
    if (page.hideFromNavigation) {
      continue;
    }

    const key = page.group ?? '';
    let items = buckets.get(key);
    if (!items) {
      items = [];
      buckets.set(key, items);
      order.push(key);
    }
    items.push(toNavigationItem(page, section));
  }

  return order.map((key) => {
    const items = buckets.get(key) ?? [];
    const group: INavigationGroup = { items };
    if (key) {
      group.text = key;
    }

    return group;
  });
}

function toNavigationItem(page: IPageDefinition, section: ISectionConfig): INavigationItem {
  const seo = page.seo;

  return {
    link: page.slug,
    text: page.text,
    pageTitle: seo.title,
    pageTitleIsFinal: resolvePageTitleIsFinal(seo, section),
    description: seo.description,
    canonical: seo.canonical,
    image: seo.image,
    image_dark: seo.imageDark,
    image_width: seo.imageWidth,
    image_height: seo.imageHeight,
    image_type: seo.imageType,
    og_type: seo.ogType,
    hideToc: page.hideToc,
    badge: page.badge,
    date: page.date,
  };
}

function resolvePageTitleIsFinal(seo: IPageDefinition['seo'], section: ISectionConfig): boolean {
  if (typeof seo.titleIsFinal === 'boolean') {
    return seo.titleIsFinal;
  }

  return !section.appendAppNameToTitle;
}

function buildComponents(section: ISectionConfig): IDynamicComponentItem[] {
  const collected: IDynamicComponentItem[] = [];
  const seen = new Set<string>();

  const push = (item: IDynamicComponentItem): void => {
    if (seen.has(item.selector)) {
      return;
    }
    seen.add(item.selector);
    collected.push(item);
  };

  for (const page of section.pages) {
    page.components?.forEach(push);
  }
  section.components?.forEach(push);

  return collected;
}

function buildSectionMeta(
  shell: IPortalShellConfig,
  section: ISectionConfig,
): IMetaData | undefined {
  const overviewSlug = section.overviewSlug ?? 'overview';
  const overview = section.pages.find((page) => page.slug === overviewSlug) ?? section.pages[0];
  if (!overview) {
    return undefined;
  }

  const seo = overview.seo;
  const defaults = shell.defaultSeo;
  const sectionUrl = `${shell.origin}${section.routePath}/${overview.slug}`;

  return {
    url: sectionUrl,
    canonical: seo.canonical ?? sectionUrl,
    type: 'website',
    title: seo.title,
    app_name: shell.appName,
    locale: defaults.locale,
    description: seo.description,
    image: seo.image ?? defaults.image,
    image_type: seo.imageType ?? defaults.imageType,
    image_width: seo.imageWidth ?? defaults.imageWidth,
    image_height: seo.imageHeight ?? defaults.imageHeight,
    keywords: section.keywords,
    robots: defaults.robots,
    twitter_card: defaults.twitterCard,
    twitter_site: defaults.twitterSite,
    twitter_creator: defaults.twitterCreator,
  };
}
