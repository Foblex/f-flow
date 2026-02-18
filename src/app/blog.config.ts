import {
  defineLazyComponent,
  defineNavigationGroup,
  INavigationGroup,
  provide404Markdown,
  provideComponents,
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
    provideNavigation(
      overviewGroup(),
      releasesGroup(),
      insideFoblexFlowGroup(),
      buildingAiLowCodePlatformGroup(),
      callFlowEditorGroup(),
    ),
    provideComponents([
      defineLazyComponent(
        'add-node-from-palette',
        () =>
          import('../../projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component'),
      ),
      defineLazyComponent(
        'ai-low-code-platform',
        () =>
          import('../../projects/f-examples/pro-examples/ai-low-code-platform/ai-low-code-platform'),
      ),
      defineLazyComponent(
        'background-example',
        () =>
          import('../../projects/f-examples/extensions/background-example/background-example.component'),
      ),
      defineLazyComponent(
        'connectable-side',
        () => import('../../projects/f-examples/connectors/connectable-side/connectable-side'),
      ),
      defineLazyComponent(
        'connection-behaviours',
        () =>
          import('../../projects/f-examples/connections/connection-behaviours/connection-behaviours'),
      ),
      defineLazyComponent(
        'connection-connectable-side',
        () =>
          import('../../projects/f-examples/connections/connection-connectable-side/connection-connectable-side'),
      ),
      defineLazyComponent(
        'connection-content',
        () => import('../../projects/f-examples/connections/connection-content/connection-content'),
      ),
      defineLazyComponent(
        'connection-markers',
        () => import('../../projects/f-examples/connections/connection-markers/connection-markers'),
      ),
      defineLazyComponent(
        'connection-rules',
        () => import('../../projects/f-examples/connectors/connection-rules/connection-rules'),
      ),
      defineLazyComponent(
        'connection-types',
        () => import('../../projects/f-examples/connections/connection-types/connection-types'),
      ),
      defineLazyComponent(
        'connection-waypoints',
        () =>
          import('../../projects/f-examples/connections/connection-waypoints/connection-waypoints'),
      ),
      defineLazyComponent(
        'custom-event-triggers',
        () =>
          import('../../projects/f-examples/advanced/custom-event-triggers/custom-event-triggers.component'),
      ),
      defineLazyComponent(
        'custom-nodes',
        () => import('../../projects/f-examples/nodes/custom-nodes/custom-nodes.component'),
      ),
      defineLazyComponent(
        'drag-handle',
        () => import('../../projects/f-examples/nodes/drag-handle/drag-handle'),
      ),
      defineLazyComponent(
        'drag-start-end-events',
        () =>
          import('../../projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component'),
      ),
      defineLazyComponent(
        'drag-to-group',
        () => import('../../projects/f-examples/nodes/drag-to-group/drag-to-group.component'),
      ),
      defineLazyComponent(
        'drag-to-reassign',
        () => import('../../projects/f-examples/connections/drag-to-reassign/drag-to-reassign'),
      ),
      defineLazyComponent(
        'grouping',
        () => import('../../projects/f-examples/nodes/grouping/grouping'),
      ),
      defineLazyComponent(
        'magnetic-lines',
        () => import('../../projects/f-examples/extensions/magnetic-lines/magnetic-lines'),
      ),
      defineLazyComponent(
        'magnetic-rects',
        () => import('../../projects/f-examples/extensions/magnetic-rects/magnetic-rects'),
      ),
      defineLazyComponent(
        'undo-redo-v2',
        () => import('../../projects/f-examples/advanced/undo-redo-v2/undo-redo-v2'),
      ),
    ]),
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
      title: 'Foblex Flow Blog - Releases, Engineering Articles and Product Updates',
      app_name: 'Foblex Flow',
      locale: 'en_US',
      description:
        'Read all Foblex Flow and related engineering posts mirrored from the official Medium profile and publications with source attribution.',
      image: 'https://flow.foblex.com/site-preview.png',
      image_type: 'image/png',
      image_width: 2986,
      image_height: 1926,
      keywords:
        'foblex flow blog, angular flowchart articles, node editor engineering, foblex flow releases, medium mirror',
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
      pageTitle: 'Foblex Flow Blog - Releases, Series and Engineering Guides',
      description:
        'Browse the mirrored article archive from the official Medium feed, grouped by release notes and article series.',
      canonical: 'https://flow.foblex.com/blog/overview',
      image: './site-preview.png',
      image_type: 'image/png',
      image_width: 2986,
      image_height: 1926,
    },
  ]);
}

function releasesGroup(): INavigationGroup {
  return defineNavigationGroup('Releases', [
    {
      link: 'foblex-flow-v18-1-0-magnetic-plugins-ai-low-code-platform-example-docs-refresh',
      text: 'v18.1.0',
      pageTitle:
        'Foblex Flow v18.1.0 Magnetic Plugins, AI Low-Code Platform Example, and a Major Docs Refresh',
      description:
        'Foblex Flow is an Angular library for building node-based editors: flows, diagrams, visual builders-with a focus on interactive UX and clean APIs.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v18-1-0-magnetic-plugins-ai-low-code-platform-example-docs-refresh',
      image: 'https://cdn-images-1.medium.com/max/800/1*d1qqO9ReXGQRrJBuh8fgug.gif',
      image_type: 'image/gif',
      date: new Date('2026-02-16T13:04:22.000Z'),
    },
    {
      link: 'foblex-flow-v18-waypoints-pinch-to-zoom-better-control-flow-support',
      text: 'v18.0.0',
      pageTitle: 'Foblex Flow v18: Waypoints, Pinch-to-Zoom, and Better Control Flow Support',
      description:
        'Foblex Flow is an Angular library for building node-based editors: flows, diagrams, visual builders — all with a focus on interactive UX and clean APIs.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v18-waypoints-pinch-to-zoom-better-control-flow-support',
      image: 'https://cdn-images-1.medium.com/max/720/1*4cdHRP4Qbh1KNDA4EFrEnQ.gif',
      image_type: 'image/gif',
      date: new Date('2026-01-26T19:39:24.000Z'),
    },
    {
      link: 'foblex-flow-v17-8-5-connectable-sides-smarter-routing',
      text: 'v17.8.5',
      pageTitle: 'Foblex Flow 17.8.5— Connectable Sides for Smarter Routing in Angular',
      description:
        'Node-based editors are becoming the backbone of AI pipelines, workflow builders, and low-code platforms. With Foblex Flow , we bring this experience natively into Angular.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v17-8-5-connectable-sides-smarter-routing',
      image: 'https://cdn-images-1.medium.com/max/1024/1*HWWQhq3K27BEpulOEqw12w.png',
      image_type: 'image/png',
      date: new Date('2025-10-05T21:23:00.000Z'),
    },
    {
      link: 'foblex-flow-v17-8-custom-content-on-connections-smarter-validation',
      text: 'v17.8.0',
      pageTitle:
        'Foblex Flow 17.8 — Custom Content on Connections and Smarter Validation in Angular',
      description:
        'Node-based editors are becoming the backbone of AI pipelines, workflow builders, and low-code platforms. With Foblex Flow , we bring this experience natively into Angular.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v17-8-custom-content-on-connections-smarter-validation',
      image: 'https://cdn-images-1.medium.com/max/1024/1*wW8qCQaR8F8RxhEFZ3dYcw.png',
      image_type: 'image/png',
      date: new Date('2025-09-15T21:07:57.000Z'),
    },
    {
      link: 'foblex-flow-17-7-smarter-grouping-copy-paste-and-undo-redo-in-angular',
      text: 'v17.7.0',
      pageTitle: 'Foblex Flow 17.7 — Smarter Grouping, Copy/Paste, and Undo/Redo in Angular',
      description:
        'Node-based editors are becoming a standard for automation, AI workflows, and low-code platforms. With Foblex Flow , we bring this power natively to Angular.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-17-7-smarter-grouping-copy-paste-and-undo-redo-in-angular',
      image: 'https://cdn-images-1.medium.com/max/800/1*k6X5w-KcFIsj-8ov5wvHZw.gif',
      image_type: 'image/gif',
      date: new Date('2025-08-25T00:23:07.000Z'),
    },
  ]);
}

function insideFoblexFlowGroup(): INavigationGroup {
  return defineNavigationGroup('Inside Foblex Flow', [
    {
      link: 'inside-foblex-flow-part-1-library-architecture-and-design-principles',
      text: 'Part 1: Library Architecture and Design Principles',
      pageTitle: 'Inside Foblex Flow — Part 1: Library Architecture and Design Principles',
      description:
        'Node-based interfaces are everywhere today: low-code platforms, workflow editors, chatbot builders, business automation systems, ETL tools. Visual logic modeling allows users to “assemble a program” without code by dragging blocks and conne',
      canonical:
        'https://flow.foblex.com/blog/inside-foblex-flow-part-1-library-architecture-and-design-principles',
      image: 'https://cdn-images-1.medium.com/max/1024/1*C5fuysW8hY46nNZDRiJgIA.png',
      image_type: 'image/png',
      date: new Date('2025-08-19T12:50:43.000Z'),
    },
    {
      link: 'inside-foblex-flow-part-2-drag-and-drop-architecture-in-angular-without-cdk',
      text: 'Part 2: Drag-and-Drop Architecture in Angular Without CDK',
      pageTitle: 'Inside Foblex Flow — Part 2: Drag-and-Drop Architecture in Angular Without CDK',
      description:
        'When we think about node-based editors, the first thing that stands out is the interaction with on-screen elements. Dragging nodes, connecting ports, zooming the canvas — that’s what brings the interface to life.',
      canonical:
        'https://flow.foblex.com/blog/inside-foblex-flow-part-2-drag-and-drop-architecture-in-angular-without-cdk',
      image: 'https://cdn-images-1.medium.com/max/1024/1*4toRlIn0M9Tm0gAIOKabbA.png',
      image_type: 'image/png',
      date: new Date('2025-08-23T00:23:20.000Z'),
    },
  ]);
}

function buildingAiLowCodePlatformGroup(): INavigationGroup {
  return defineNavigationGroup('Building AI Low-Code Platform', [
    {
      link: 'building-ai-low-code-platform-in-angular-part-1-introduction-to-foblex-flow',
      text: 'Part 1: Introduction to Foblex Flow',
      pageTitle: 'Building Visual Interfaces in Angular — Introducing Foblex Flow',
      description:
        'Introduction to the series and the Foblex Flow library — a flexible tool for creating flow-based UIs in Angular.',
      canonical:
        'https://flow.foblex.com/blog/building-ai-low-code-platform-in-angular-part-1-introduction-to-foblex-flow',
      image: 'https://miro.medium.com/v2/resize:fit:1200/1*3i5vp47Vv-b-wT7sQi1zPw.png',
      image_type: 'image/png',
      date: new Date('2025-06-15T12:00:00.000Z'),
    },
    {
      link: 'building-ai-low-code-platform-in-angular-part-2-creating-your-first-flow',
      text: 'Part 2: Creating Your First Flow',
      pageTitle: 'Design Node-Based Interfaces in Angular — A Beginner’s Guide with Foblex Flow',
      description:
        'Learn how to render a flow, create basic draggable nodes, and connect them. This is the foundation for your AI low-code platform.',
      canonical:
        'https://flow.foblex.com/blog/building-ai-low-code-platform-in-angular-part-2-creating-your-first-flow',
      image: 'https://miro.medium.com/v2/resize:fit:1200/1*l97rHn7-xXzmGxgbZDu-qw.png',
      image_type: 'image/png',
      date: new Date('2025-06-23T12:00:00.000Z'),
    },
    {
      link: 'building-ai-low-code-platform-in-angular-part-3-creating-custom-nodes-and-a-node-palette',
      text: 'Part 3: Creating Custom Nodes and a Node Palette',
      pageTitle:
        'Building AI Low-Code Platform in Angular — Part 3: Creating Custom Nodes and a Node Palette',
      description:
        'In the previous article, we built a basic editor with two nodes and a single connection. Now, let’s take the next step — we’ll add custom Angular node components, interactive connectors, and a simple node palette.',
      canonical:
        'https://flow.foblex.com/blog/building-ai-low-code-platform-in-angular-part-3-creating-custom-nodes-and-a-node-palette',
      image: 'https://cdn-images-1.medium.com/max/1024/1*RYPpEhabtg8HXuDrbcrpKw.png',
      image_type: 'image/png',
      date: new Date('2025-07-05T13:43:53.000Z'),
    },
    {
      link: 'building-ai-low-code-platform-in-angular-part-4-styling-and-handling-connections',
      text: 'Part 4: Styling and Handling Connections',
      pageTitle:
        'Building AI Low-Code Platform in Angular — Part 4: Styling and Handling Connections',
      description:
        'In the previous part, we brought our node editor to life with custom components and a dynamic palette. But nodes alone don’t make the magic — the real power comes from how they connect . And more importantly, how those connections behave, l',
      canonical:
        'https://flow.foblex.com/blog/building-ai-low-code-platform-in-angular-part-4-styling-and-handling-connections',
      image: 'https://cdn-images-1.medium.com/max/1024/1*UUQTSP7q7aDNWBhh-zhGnw.png',
      image_type: 'image/png',
      date: new Date('2025-08-06T16:43:26.000Z'),
    },
  ]);
}

function callFlowEditorGroup(): INavigationGroup {
  return defineNavigationGroup('Call Flow Editor', [
    {
      link: 'call-center-flow-editor-now-updated-with-angular-20-signals',
      text: 'Angular 20 Update',
      pageTitle: 'Call Center Flow Editor — now updated with Angular 20 & Signals',
      description:
        'About a year ago I shared a small side project: a call center flow editor built on top of Foblex Flow .',
      canonical:
        'https://flow.foblex.com/blog/call-center-flow-editor-now-updated-with-angular-20-signals',
      image: 'https://cdn-images-1.medium.com/max/1024/1*iXc5ysiX_VEXlnDXO2eQCg.png',
      image_type: 'image/png',
      date: new Date('2025-09-03T20:51:45.000Z'),
    },
    {
      link: 'creating-a-visual-call-workflow-editor-with-angular',
      text: 'Initial Tutorial',
      pageTitle: 'Creating a visual call workflow editor with Angular',
      description:
        'In this tutorial, we create a visual call workflow editor in Angular using @foblex/flow.',
      canonical: 'https://flow.foblex.com/blog/creating-a-visual-call-workflow-editor-with-angular',
      image: 'https://miro.medium.com/v2/resize:fit:1200/1*NTj5x-WRLZ4-kGAVhvwcEA.png',
      image_type: 'image/png',
      date: new Date('2024-03-28T12:00:00.000Z'),
    },
  ]);
}
