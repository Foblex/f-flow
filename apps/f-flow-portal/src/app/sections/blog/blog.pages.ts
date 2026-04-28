import { defineLazyComponent, IPageDefinition } from '@foblex/m-render';

/**
 * One entry per page in the /blog section.
 *
 * Adding or renaming a post = editing this list, nothing else.
 * SEO, sidebar group, og:type and per-page lazy components live here together.
 *
 * The first page is the section landing (slug: 'overview') — its SEO becomes
 * the section's default <meta>/OG tags (see ISectionConfig.overviewSlug).
 */
export const BLOG_PAGES: IPageDefinition[] = [
  // -------- Articles (landing) --------
  {
    slug: 'overview',
    text: 'Overview',
    group: 'Articles',
    seo: {
      title: 'Foblex Flow Articles',
      description:
        'Release notes, architecture articles, and Angular tutorials for node editors, workflow builders, and graph UI development with Foblex Flow.',
      canonical: 'https://flow.foblex.com/blog/overview',
      image: './site-preview.png',
      imageType: 'image/png',
      imageWidth: 1688,
      imageHeight: 937,
    },
  },

  // -------- Releases --------
  {
    slug: 'foblex-flow-v18-6-0-smart-auto-layout-on-resize',
    text: 'v18.6.0',
    group: 'Releases',
    date: new Date('2026-04-26T12:00:00.000Z'),
    seo: {
      title: 'Foblex Flow v18.6.0: Smart Auto-Layout on Resize',
      description:
        'Foblex Flow v18.6 ships the new `withReflowOnResize` plugin: when a node grows or shrinks, the surrounding nodes shift automatically along configurable mode, scope, axis, delta source, and collision rules.',
      canonical: 'https://flow.foblex.com/blog/foblex-flow-v18-6-0-smart-auto-layout-on-resize',
      image: 'https://flow.foblex.com/previews/examples/reflow-on-resize.light.png',
      imageType: 'image/png',
      imageWidth: 2116,
      imageHeight: 1200,
      ogType: 'article',
    },
  },
  {
    slug: 'foblex-flow-v18-5-0-layout-engines-explicit-render-lifecycle-and-standalone-reference-apps',
    text: 'v18.5.0',
    group: 'Releases',
    date: new Date('2026-04-14T12:00:00.000Z'),
    seo: {
      title:
        'Foblex Flow v18.5.0: Layout Engines, Explicit Render Lifecycle, and Standalone Reference Apps',
      description:
        'Foblex Flow v18.5 introduces Dagre and ELK layout packages, explicit render lifecycle outputs, standalone reference apps, and a stronger portal/docs toolchain.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v18-5-0-layout-engines-explicit-render-lifecycle-and-standalone-reference-apps',
      image: 'https://flow.foblex.com/previews/examples/dagre-layout.light.png',
      imageType: 'image/png',
      imageWidth: 1600,
      imageHeight: 1200,
      ogType: 'article',
    },
  },
  {
    slug: 'foblex-flow-v18-4-0-auto-pan-default-theme-and-smoother-trackpad-zoom',
    text: 'v18.4.0',
    group: 'Releases',
    date: new Date('2026-04-02T12:00:00.000Z'),
    seo: {
      title: 'Foblex Flow v18.4.0: Auto-Pan, Default Theme, and Smoother Trackpad Zoom',
      description:
        'Foblex Flow v18.4 introduces the opt-in f-auto-pan plugin, ships a default theme entrypoint, smooths trackpad pinch-to-zoom, and refreshes example portal controls and docs.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v18-4-0-auto-pan-default-theme-and-smoother-trackpad-zoom',
      image: 'https://flow.foblex.com/previews/examples/auto-pan.light.png',
      imageType: 'image/png',
      imageWidth: 2120,
      imageHeight: 1200,
      ogType: 'article',
    },
  },
  {
    slug: 'foblex-flow-v18-3-0-projected-connection-gradients-smarter-redraws-and-production-worker-hardening',
    text: 'v18.3.0',
    group: 'Releases',
    date: new Date('2026-03-17T12:00:00.000Z'),
    seo: {
      title:
        'Foblex Flow v18.3.0: Projected Connection Gradients, Smarter Redraws, and Production Worker Hardening',
      description:
        'Foblex Flow v18.3 introduces projected connection gradients, reduces redundant redraw work, fixes connection worker production loading, and refreshes roadmap/docs guidance.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v18-3-0-projected-connection-gradients-smarter-redraws-and-production-worker-hardening',
      image: 'https://flow.foblex.com/previews/examples/custom-connections.light.png',
      imageType: 'image/png',
      imageWidth: 1688,
      imageHeight: 937,
      ogType: 'article',
    },
  },
  {
    slug: 'foblex-flow-v18-2-0-caching-virtualization-connection-worker-performance-refresh',
    text: 'v18.2.0',
    group: 'Releases',
    date: new Date('2026-03-09T12:00:00.000Z'),
    seo: {
      title:
        'Foblex Flow v18.2.0: Caching, Virtualization, Connection Worker, and a Major Performance Refresh',
      description:
        'Foblex Flow v18.2 adds optional caching, progressive virtualization, worker-assisted connection calculation, zoom during drag, and broader redraw optimizations for large Angular editors.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v18-2-0-caching-virtualization-connection-worker-performance-refresh',
      image: 'https://flow.foblex.com/previews/examples/stress-test.light.png',
      imageType: 'image/png',
      imageWidth: 2140,
      imageHeight: 1200,
      ogType: 'article',
    },
  },
  {
    slug: 'foblex-flow-v18-1-0-magnetic-plugins-ai-low-code-platform-example-docs-refresh',
    text: 'v18.1.0',
    group: 'Releases',
    date: new Date('2026-02-16T13:04:22.000Z'),
    seo: {
      title:
        'Foblex Flow v18.1.0 Magnetic Plugins, AI Low-Code Platform Example, and a Major Docs Refresh',
      description:
        'Foblex Flow v18.1 adds Magnetic Lines, Magnetic Rects, a stronger AI workflow example, and refreshed Angular documentation.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v18-1-0-magnetic-plugins-ai-low-code-platform-example-docs-refresh',
      image: 'https://cdn-images-1.medium.com/max/800/1*d1qqO9ReXGQRrJBuh8fgug.gif',
      imageType: 'image/gif',
      ogType: 'article',
    },
  },
  {
    slug: 'foblex-flow-v18-waypoints-pinch-to-zoom-better-control-flow-support',
    text: 'v18.0.0',
    group: 'Releases',
    date: new Date('2026-01-26T19:39:24.000Z'),
    seo: {
      title: 'Foblex Flow v18: Waypoints, Pinch-to-Zoom, and Better Control Flow Support',
      description:
        'Foblex Flow v18 adds connection waypoints, pinch-to-zoom, and Angular control-flow improvements for richer node-based editors.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v18-waypoints-pinch-to-zoom-better-control-flow-support',
      image: 'https://cdn-images-1.medium.com/max/720/1*4cdHRP4Qbh1KNDA4EFrEnQ.gif',
      imageType: 'image/gif',
      ogType: 'article',
    },
  },
  {
    slug: 'foblex-flow-v17-8-5-connectable-sides-smarter-routing',
    text: 'v17.8.5',
    group: 'Releases',
    date: new Date('2025-10-05T21:23:00.000Z'),
    seo: {
      title: 'Foblex Flow 17.8.5— Connectable Sides for Smarter Routing in Angular',
      description:
        'Foblex Flow 17.8.5 adds connectable side controls so Angular teams can route node connections with more precision and less visual noise.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v17-8-5-connectable-sides-smarter-routing',
      image: 'https://cdn-images-1.medium.com/max/1024/1*HWWQhq3K27BEpulOEqw12w.png',
      imageType: 'image/png',
      ogType: 'article',
    },
  },
  {
    slug: 'foblex-flow-v17-8-custom-content-on-connections-smarter-validation',
    text: 'v17.8.0',
    group: 'Releases',
    date: new Date('2025-09-15T21:07:57.000Z'),
    seo: {
      title: 'Foblex Flow 17.8 — Custom Content on Connections and Smarter Validation in Angular',
      description:
        'Foblex Flow 17.8 adds connection content and smarter validation rules for Angular workflow builders, node editors, and diagram interfaces.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-v17-8-custom-content-on-connections-smarter-validation',
      image: 'https://cdn-images-1.medium.com/max/1024/1*wW8qCQaR8F8RxhEFZ3dYcw.png',
      imageType: 'image/png',
      ogType: 'article',
    },
  },
  {
    slug: 'foblex-flow-17-7-smarter-grouping-copy-paste-and-undo-redo-in-angular',
    text: 'v17.7.0',
    group: 'Releases',
    date: new Date('2025-08-25T00:23:07.000Z'),
    seo: {
      title: 'Foblex Flow 17.7 — Smarter Grouping, Copy/Paste, and Undo/Redo in Angular',
      description:
        'Foblex Flow 17.7 adds grouping improvements, copy/paste, and undo/redo patterns for Angular node editors and workflow builders.',
      canonical:
        'https://flow.foblex.com/blog/foblex-flow-17-7-smarter-grouping-copy-paste-and-undo-redo-in-angular',
      image: 'https://cdn-images-1.medium.com/max/800/1*k6X5w-KcFIsj-8ov5wvHZw.gif',
      imageType: 'image/gif',
      ogType: 'article',
    },
  },

  // -------- Inside Foblex Flow --------
  {
    slug: 'inside-foblex-flow-part-1-library-architecture-and-design-principles',
    text: 'Part 1: Library Architecture and Design Principles',
    group: 'Inside Foblex Flow',
    date: new Date('2025-08-19T12:50:43.000Z'),
    seo: {
      title: 'Inside Foblex Flow — Part 1: Library Architecture and Design Principles',
      description:
        'Inside Foblex Flow Part 1 explains the architecture and design principles behind an Angular-native node-based UI library.',
      canonical:
        'https://flow.foblex.com/blog/inside-foblex-flow-part-1-library-architecture-and-design-principles',
      image: 'https://cdn-images-1.medium.com/max/1024/1*C5fuysW8hY46nNZDRiJgIA.png',
      imageType: 'image/png',
      ogType: 'article',
    },
  },
  {
    slug: 'inside-foblex-flow-part-2-drag-and-drop-architecture-in-angular-without-cdk',
    text: 'Part 2: Drag-and-Drop Architecture in Angular Without CDK',
    group: 'Inside Foblex Flow',
    date: new Date('2025-08-23T00:23:20.000Z'),
    seo: {
      title: 'Inside Foblex Flow — Part 2: Drag-and-Drop Architecture in Angular Without CDK',
      description:
        'Inside Foblex Flow Part 2 explains the custom drag-and-drop architecture behind Angular node editors, connections, and canvas interactions.',
      canonical:
        'https://flow.foblex.com/blog/inside-foblex-flow-part-2-drag-and-drop-architecture-in-angular-without-cdk',
      image: 'https://cdn-images-1.medium.com/max/1024/1*4toRlIn0M9Tm0gAIOKabbA.png',
      imageType: 'image/png',
      ogType: 'article',
    },
  },
  {
    slug: 'designing-a-stateless-library-how-foblex-flow-avoids-owning-your-data',
    text: 'Part 3: Designing a Stateless Library',
    group: 'Inside Foblex Flow',
    date: new Date('2026-04-24T12:00:00.000Z'),
    seo: {
      title: 'Designing a Stateless Library — How Foblex Flow Avoids Owning Your Data',
      description:
        'Why Foblex Flow does not own your nodes, edges, or graph state — and how that decision shapes persistence, undo/redo, optimistic updates, and collaboration in your editor.',
      canonical:
        'https://flow.foblex.com/blog/designing-a-stateless-library-how-foblex-flow-avoids-owning-your-data',
      image: 'https://flow.foblex.com/site-preview.png',
      imageType: 'image/png',
      imageWidth: 1688,
      imageHeight: 937,
      ogType: 'article',
    },
  },

  // -------- Building AI Low-Code Platform --------
  {
    slug: 'building-ai-low-code-platform-in-angular-part-1-introduction-to-foblex-flow',
    text: 'Part 1: Introduction to Foblex Flow',
    group: 'Building AI Low-Code Platform',
    date: new Date('2025-06-15T12:00:00.000Z'),
    seo: {
      title: 'Building Visual Interfaces in Angular — Introducing Foblex Flow',
      description:
        'Start this Angular tutorial series on building node-based UIs, workflow builders, and visual editors with Foblex Flow in Angular apps.',
      canonical:
        'https://flow.foblex.com/blog/building-ai-low-code-platform-in-angular-part-1-introduction-to-foblex-flow',
      image: 'https://miro.medium.com/v2/resize:fit:1200/1*3i5vp47Vv-b-wT7sQi1zPw.png',
      imageType: 'image/png',
      ogType: 'article',
    },
  },
  {
    slug: 'building-ai-low-code-platform-in-angular-part-2-creating-your-first-flow',
    text: 'Part 2: Creating Your First Flow',
    group: 'Building AI Low-Code Platform',
    date: new Date('2025-06-23T12:00:00.000Z'),
    seo: {
      title: 'Design Node-Based Interfaces in Angular — A Beginner’s Guide with Foblex Flow',
      description:
        'Render your first Angular flow with draggable nodes and connections using Foblex Flow, the foundation for workflow builders and node editors.',
      canonical:
        'https://flow.foblex.com/blog/building-ai-low-code-platform-in-angular-part-2-creating-your-first-flow',
      image: 'https://miro.medium.com/v2/resize:fit:1200/1*l97rHn7-xXzmGxgbZDu-qw.png',
      imageType: 'image/png',
      ogType: 'article',
    },
  },
  {
    slug: 'building-ai-low-code-platform-in-angular-part-3-creating-custom-nodes-and-a-node-palette',
    text: 'Part 3: Creating Custom Nodes and a Node Palette',
    group: 'Building AI Low-Code Platform',
    date: new Date('2025-07-05T13:43:53.000Z'),
    seo: {
      title:
        'Building AI Low-Code Platform in Angular — Part 3: Creating Custom Nodes and a Node Palette',
      description:
        'Build custom Angular nodes, interactive connectors, and a node palette with Foblex Flow to move from a basic demo to a real editor.',
      canonical:
        'https://flow.foblex.com/blog/building-ai-low-code-platform-in-angular-part-3-creating-custom-nodes-and-a-node-palette',
      image: 'https://cdn-images-1.medium.com/max/1024/1*RYPpEhabtg8HXuDrbcrpKw.png',
      imageType: 'image/png',
      ogType: 'article',
    },
  },
  {
    slug: 'building-ai-low-code-platform-in-angular-part-4-styling-and-handling-connections',
    text: 'Part 4: Styling and Handling Connections',
    group: 'Building AI Low-Code Platform',
    date: new Date('2025-08-06T16:43:26.000Z'),
    seo: {
      title: 'Building AI Low-Code Platform in Angular — Part 4: Styling and Handling Connections',
      description:
        'Style Angular flow connections, add markers, and support connection reassignment with Foblex Flow for richer workflow builder UX.',
      canonical:
        'https://flow.foblex.com/blog/building-ai-low-code-platform-in-angular-part-4-styling-and-handling-connections',
      image: 'https://cdn-images-1.medium.com/max/1024/1*UUQTSP7q7aDNWBhh-zhGnw.png',
      imageType: 'image/png',
      ogType: 'article',
    },
  },

  // -------- Call Flow Editor --------
  {
    slug: 'call-center-flow-editor-now-updated-with-angular-20-signals',
    text: 'Angular 20 Update',
    group: 'Call Flow Editor',
    date: new Date('2025-09-03T20:51:45.000Z'),
    seo: {
      title: 'Call Center Flow Editor — now updated with Angular 20 & Signals',
      description:
        'See how a visual call flow editor built with Foblex Flow was updated to Angular 20, Signals, undo/redo, and a cleaner editing UX.',
      canonical:
        'https://flow.foblex.com/blog/call-center-flow-editor-now-updated-with-angular-20-signals',
      image: 'https://cdn-images-1.medium.com/max/1024/1*iXc5ysiX_VEXlnDXO2eQCg.png',
      imageType: 'image/png',
      ogType: 'article',
    },
  },
  {
    slug: 'creating-a-visual-call-workflow-editor-with-angular',
    text: 'Initial Tutorial',
    group: 'Call Flow Editor',
    date: new Date('2024-03-28T12:00:00.000Z'),
    seo: {
      title: 'Creating a visual call workflow editor with Angular',
      description:
        'Build a visual call workflow editor in Angular with Foblex Flow, including node models, draggable nodes, and editable connections.',
      canonical: 'https://flow.foblex.com/blog/creating-a-visual-call-workflow-editor-with-angular',
      image: 'https://miro.medium.com/v2/resize:fit:1200/1*NTj5x-WRLZ4-kGAVhvwcEA.png',
      imageType: 'image/png',
      ogType: 'article',
    },
  },
];

/**
 * Components used inside blog markdown via custom container syntax.
 *
 * Kept at section level for now (escape hatch) — moving each entry to the
 * blog post that actually uses it can be done incrementally; that requires
 * inspecting each .md to map components -> posts.
 */
export const BLOG_COMPONENTS = [
  defineLazyComponent(
    'add-node-from-palette',
    () => import('@foblex/examples/extensions/add-node-from-palette/example'),
  ),
  defineLazyComponent('auto-pan', () => import('@foblex/examples/extensions/auto-pan/example')),
  defineLazyComponent(
    'dagre-layout-auto',
    () => import('@foblex/examples/plugins/f-layout/dagre-layout-auto/example'),
  ),
  defineLazyComponent(
    'reflow-basics',
    () => import('@foblex/examples/plugins/reflow-on-resize/basics/example'),
  ),
  defineLazyComponent(
    'reflow-mode',
    () => import('@foblex/examples/plugins/reflow-on-resize/mode/example'),
  ),
  defineLazyComponent(
    'ai-low-code-platform',
    () => import('@foblex/examples/external-apps/ai-low-code-platform/ai-low-code-platform'),
  ),
  defineLazyComponent(
    'background-example',
    () => import('@foblex/examples/extensions/background-example/example'),
  ),
  defineLazyComponent(
    'connectable-side',
    () => import('@foblex/examples/connectors/connectable-side/example'),
  ),
  defineLazyComponent(
    'connection-behaviours',
    () => import('@foblex/examples/connections/connection-behaviours/example'),
  ),
  defineLazyComponent(
    'connection-connectable-side',
    () => import('@foblex/examples/connections/connection-connectable-side/example'),
  ),
  defineLazyComponent(
    'connection-content',
    () => import('@foblex/examples/connections/connection-content/example'),
  ),
  defineLazyComponent(
    'connection-gradients',
    () => import('@foblex/examples/connections/custom-connections/example'),
  ),
  defineLazyComponent(
    'connection-markers',
    () => import('@foblex/examples/connections/connection-markers/example'),
  ),
  defineLazyComponent(
    'connection-rules',
    () => import('@foblex/examples/connectors/connection-rules/example'),
  ),
  defineLazyComponent(
    'connection-types',
    () => import('@foblex/examples/connections/connection-types/example'),
  ),
  defineLazyComponent(
    'connection-waypoints',
    () => import('@foblex/examples/connections/connection-waypoints/example'),
  ),
  defineLazyComponent(
    'custom-event-triggers',
    () => import('@foblex/examples/advanced/custom-event-triggers/example'),
  ),
  defineLazyComponent('custom-nodes', () => import('@foblex/examples/nodes/custom-nodes/example')),
  defineLazyComponent('drag-handle', () => import('@foblex/examples/nodes/drag-handle/example')),
  defineLazyComponent(
    'drag-start-end-events',
    () => import('@foblex/examples/advanced/drag-start-end-events/example'),
  ),
  defineLazyComponent(
    'drag-to-group',
    () => import('@foblex/examples/nodes/drag-to-group/example'),
  ),
  defineLazyComponent(
    'drag-to-reassign',
    () => import('@foblex/examples/connections/drag-to-reassign/example'),
  ),
  defineLazyComponent('grouping', () => import('@foblex/examples/nodes/grouping/example')),
  defineLazyComponent(
    'magnetic-lines',
    () => import('@foblex/examples/extensions/magnetic-lines/example'),
  ),
  defineLazyComponent(
    'magnetic-rects',
    () => import('@foblex/examples/extensions/magnetic-rects/example'),
  ),
  defineLazyComponent('stress-test', () => import('@foblex/examples/nodes/stress-test/example')),
  defineLazyComponent(
    'stress-test-with-connections',
    () => import('@foblex/examples/nodes/stress-test-with-connections/example'),
  ),
  defineLazyComponent(
    'undo-redo-v2',
    () => import('@foblex/examples/advanced/undo-redo-v2/example'),
  ),
];
