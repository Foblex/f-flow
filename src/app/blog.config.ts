import {
  defineNavigationGroup,
  INavigationGroup,
  provide404Markdown,
  provideDirectory,
  provideFooterNavigation,
  provideHeader,
  provideHeaderMediaLinks,
  provideHeaderNavigation,
  provideHeaderSearch,
  provideLanguage,
  provideLogo,
  provideMeta,
  provideNavigation,
  provideTableOfContent,
  provideTitle,
} from '@foblex/m-render';

export const BLOG_CONFIGURATION = {
  providers: [
    provideLanguage('en'),
    provideDirectory('./markdown/blog/'),
    provide404Markdown('./markdown/404.md'),
    provideLogo('./logo.svg'),
    provideTitle('Foblex Flow'),
    provideNavigation(overviewGroup(), latestReleasesGroup()),
    provideTableOfContent({
      title: 'In this article',
      range: { start: 2, end: 4 },
    }),
    provideHeader(
      provideHeaderSearch(false),
      provideHeaderNavigation([
        {
          link: '/docs/get-started',
          active: '/docs',
          text: 'Docs',
        },
        {
          link: '/examples/overview',
          active: '/examples',
          text: 'Examples',
        },
        {
          link: '/showcase/overview',
          active: '/showcase',
          text: 'Showcase',
        },
        {
          link: '/blog/overview',
          active: '/blog',
          text: 'Blog',
        },
      ]),
      provideHeaderMediaLinks([
        { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
        { icon: 'twitter', link: 'https://x.com/foblexflow' },
      ]),
    ),
    provideFooterNavigation({
      previous: 'Previous Post',
      next: 'Next Post',
    }),
    provideMeta({
      url: 'https://flow.foblex.com/blog/overview',
      canonical: 'https://flow.foblex.com/blog/overview',
      type: 'website',
      title: 'Foblex Flow Blog - Releases, Features and Product Updates',
      app_name: 'Foblex Flow',
      locale: 'en_US',
      description:
        'Track the latest Foblex Flow releases, feature updates, and engineering notes for Angular flowchart and node-editor applications.',
      image: 'https://flow.foblex.com/site-preview.png',
      image_type: 'image/png',
      image_width: 2986,
      image_height: 1926,
      keywords:
        'foblex flow blog, foblex flow releases, angular flowchart updates, angular diagram changelog, node editor release notes',
      robots: 'index, follow, max-image-preview:large',
      twitter_card: 'summary_large_image',
      twitter_site: '@foblexflow',
      twitter_creator: '@foblexflow',
    }),
  ],
};

function overviewGroup(): INavigationGroup {
  return defineNavigationGroup('Blog', [
    {
      link: 'overview',
      text: 'Overview',
      pageTitle: 'Foblex Flow Blog - Release Notes and Engineering Updates',
      description:
        'Read recent Foblex Flow release posts with feature highlights, migration notes, and practical Angular examples.',
      canonical: 'https://flow.foblex.com/blog/overview',
      image: './site-preview.png',
      image_type: 'image/png',
      image_width: 2986,
      image_height: 1926,
    },
  ]);
}

function latestReleasesGroup(): INavigationGroup {
  return defineNavigationGroup('Latest releases', [
    {
      link: 'foblex-flow-v18-1-0-magnetic-plugins-ai-low-code-platform-example-docs-refresh',
      text: 'Foblex Flow v18.1.0',
      pageTitle:
        'Foblex Flow v18.1.0 Magnetic Plugins, AI Low-Code Platform Example, and a Major Docs Refresh',
      description:
        'Release highlights: magnetic plugins, a new AI low-code platform example, and a major documentation refresh.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v18-1-0-magnetic-plugins-ai-low-code-platform-example-docs-refresh',
      image: './previews/examples/ai-low-code.light.png',
      image_dark: './previews/examples/ai-low-code.dark.png',
      image_type: 'image/png',
      badge: {
        text: 'Release',
        type: 'info',
      },
      date: new Date('2026-02-16T13:04:22Z'),
    },
    {
      link: 'foblex-flow-v18-waypoints-pinch-to-zoom-better-control-flow-support',
      text: 'Foblex Flow v18',
      pageTitle: 'Foblex Flow v18: Waypoints, Pinch-to-Zoom, and Better Control Flow Support',
      description:
        'Release highlights: editable connection waypoints, touch pinch-to-zoom, and improved control-flow coverage.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v18-waypoints-pinch-to-zoom-better-control-flow-support',
      image: './previews/examples/connection-waypoints.light.png',
      image_dark: './previews/examples/connection-waypoints.dark.png',
      image_type: 'image/png',
      badge: {
        text: 'Release',
        type: 'info',
      },
      date: new Date('2026-01-26T19:39:24Z'),
    },
    {
      link: 'foblex-flow-v17-8-5-connectable-sides-smarter-routing',
      text: 'Foblex Flow v17.8.5',
      pageTitle: 'Foblex Flow 17.8.5 — Connectable Sides for Smarter Routing in Angular',
      description:
        'Release highlights: connectable sides to improve edge routing control and connector ergonomics in Angular diagrams.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v17-8-5-connectable-sides-smarter-routing',
      image: './previews/examples/connectable-side.light.png',
      image_dark: './previews/examples/connectable-side.dark.png',
      image_type: 'image/png',
      badge: {
        text: 'Release',
        type: 'info',
      },
      date: new Date('2025-10-05T21:23:00Z'),
    },
    {
      link: 'foblex-flow-v17-8-custom-content-on-connections-smarter-validation',
      text: 'Foblex Flow v17.8',
      pageTitle:
        'Foblex Flow 17.8 — Custom Content on Connections and Smarter Validation in Angular',
      description:
        'Release highlights: custom content on connections and stronger validation rules for connection behavior.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v17-8-custom-content-on-connections-smarter-validation',
      image: './previews/examples/connection-content.light.png',
      image_dark: './previews/examples/connection-content.dark.png',
      image_type: 'image/png',
      badge: {
        text: 'Release',
        type: 'info',
      },
      date: new Date('2025-09-15T21:07:57Z'),
    },
  ]);
}
