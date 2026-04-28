import { defineLazyComponent, IPageDefinition } from '@foblex/m-render';

/**
 * One entry per page in the /examples section.
 *
 * Section default: `appendAppNameToTitle: true` — so the meta service appends
 * " | Foblex Flow" to each page <title>. The 'overview' page overrides with
 * `titleIsFinal: true` because its current rendered title comes from the
 * markdown frontmatter (no app-name suffix).
 *
 * Per-page rendering hints (hide TOC, expand content to full width) still
 * live in markdown frontmatter (`toc: false` / `wideContent: true`) — they are
 * content layout, not SEO, and not at risk of out-of-sync drift.
 */
export const EXAMPLES_PAGES: IPageDefinition[] = [
  // -------- Introduction --------
  {
    slug: 'overview',
    text: 'Overview',
    group: 'Introduction',
    seo: {
      titleIsFinal: true,
      title: 'Foblex Flow Examples for Angular Node Editors and Workflow Builders',
      description:
        'Explore Foblex Flow examples for Angular teams, from simple starting points to full reference apps for node editors, workflow builders, and interactive diagrams.',
      image: './previews/examples/examples-overview.light.png',
      imageDark: './previews/examples/examples-overview.dark.png',
      imageWidth: 1612,
      imageHeight: 1392,
      imageType: 'image/png',
    },
  },

  // -------- Nodes --------
  {
    slug: 'custom-nodes',
    text: 'Custom Nodes',
    group: 'Nodes',
    date: new Date('2024-10-02 16:04:08'),
    seo: {
      title: 'Angular Flowchart Example – Custom Nodes with Ports, Styles & Events',
      description:
        'Create custom nodes in Angular flowcharts: ports, styles, templates and events. Practical example with reusable code.',
      image: './previews/examples/custom-nodes.light.png',
      imageDark: './previews/examples/custom-nodes.dark.png',
      imageWidth: 795,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'drag-handle',
    text: 'Drag Handle',
    group: 'Nodes',
    date: new Date('2025-07-19 13:00:22'),
    seo: {
      title: 'Angular Diagram Example – Node Drag Handle for Precise Movement',
      description:
        'Add a drag handle to nodes for precise movement. Clean UX patterns and Angular code you can reuse.',
      image: './previews/examples/drag-handle.light.png',
      imageDark: './previews/examples/drag-handle.dark.png',
      imageWidth: 795,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'node-selection',
    text: 'Node Selection',
    group: 'Nodes',
    date: new Date('2025-07-19 17:23:21'),
    seo: {
      title: 'Angular Diagram Example – Node Selection & Multi-Select with Foblex Flow',
      description:
        'Select single and multiple nodes in Angular with click-based and keyboard-modified interactions. Solid base for batch actions, grouping, and richer editor UX.',
      image: './previews/examples/node-selection.light.png',
      imageDark: './previews/examples/node-selection.dark.png',
      imageWidth: 781,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'resize-handle',
    text: 'Resize Handle',
    group: 'Nodes',
    date: new Date('2024-10-02 16:04:08'),
    seo: {
      title: 'Angular Diagram Example – Resizable Nodes with Resize Handles',
      description:
        'Make Angular diagram nodes resizable with dedicated handles. Useful for notes, groups, panels, and richer node-based UI layouts.',
      image: './previews/examples/resize-handle.light.png',
      imageDark: './previews/examples/resize-handle.dark.png',
      imageWidth: 801,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'rotate-handle',
    text: 'Rotate Handle',
    group: 'Nodes',
    date: new Date('2025-02-23 20:56:08'),
    seo: {
      title: 'Angular Diagram Example – Node Rotation Handles with Constraints',
      description:
        'Rotate Angular diagram nodes with a dedicated handle. Clear orientation control for design-like editors, architecture views, and custom canvas tools.',
      image: './previews/examples/rotate-handle.light.png',
      imageDark: './previews/examples/rotate-handle.dark.png',
      imageWidth: 795,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'grouping',
    text: 'Grouping',
    group: 'Nodes',
    date: new Date('2025-08-23 16:04:08'),
    seo: {
      title: 'Angular Flowchart Example – Node Grouping & Nested Structures',
      description:
        'Group nodes and build nested structures with auto-sizing and padding. Includes smart geometry tips and Angular example.',
      image: './previews/examples/grouping.light.png',
      imageDark: './previews/examples/grouping.dark.png',
      imageWidth: 2116,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },
  {
    slug: 'drag-to-group',
    text: 'Drag to Group',
    group: 'Nodes',
    date: new Date('2025-08-23 16:04:08'),
    seo: {
      title: 'Angular Diagram Example – Drag Nodes into Groups with Foblex Flow',
      description:
        'Drag nodes into groups in Foblex Flow, create nested hierarchies, and build dynamic structures with auto-sizing, padding, and drop events in Angular.',
      image: './previews/examples/drag-to-group.light.png',
      imageDark: './previews/examples/drag-to-group.dark.png',
      imageWidth: 2116,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },

  // -------- Connectors --------
  {
    slug: 'node-as-connector',
    text: 'Node as Connector',
    group: 'Connectors',
    date: new Date('2024-10-02 16:04:08'),
    seo: {
      title: 'Angular Diagram Example – Use a Node as a Connector',
      description:
        'Use the node itself as a connector in Angular graph UIs. A compact pattern for slot-based builders, touch-friendly editors, and dense canvases.',
      image: './previews/examples/node-as-connector.light.png',
      imageDark: './previews/examples/node-as-connector.dark.png',
      imageWidth: 726,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'connector-inside-node',
    text: 'Connector Inside Node',
    group: 'Connectors',
    date: new Date('2024-10-02 16:04:08'),
    seo: {
      title: 'Angular Diagram Example – Place Connectors Inside Nodes',
      description:
        'Place connectors inside Angular nodes to keep ports close to the fields or actions they represent. A practical pattern for compact editor UIs.',
      image: './previews/examples/connector-inside-node.light.png',
      imageDark: './previews/examples/connector-inside-node.dark.png',
      imageWidth: 726,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'connector-outlet',
    text: 'Connector Outlet',
    group: 'Connectors',
    date: new Date('2024-10-02 16:04:08'),
    seo: {
      title: 'Angular Diagram Example – Connector Outlet for Branching Nodes',
      description:
        'Use outlet connectors to control where edges leave a node. Cleaner fan-out, clearer branching, and better routing for Angular workflow builders.',
      image: './previews/examples/connector-outlet.light.png',
      imageDark: './previews/examples/connector-outlet.dark.png',
      imageWidth: 726,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'limiting-connections',
    text: 'Limiting Connections',
    group: 'Connectors',
    date: new Date('2024-10-02 16:04:08'),
    seo: {
      title: 'Angular Diagram Example – Limit Connections per Port or Node',
      description:
        'Restrict how many connections a node or port can accept in Angular. Enforce graph rules early and prevent invalid or messy states.',
      image: './previews/examples/limiting-connections.light.png',
      imageDark: './previews/examples/limiting-connections.dark.png',
      imageWidth: 726,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'connection-rules',
    text: 'Connection Rules',
    group: 'Connectors',
    date: new Date('2025-09-13 15:04:46'),
    seo: {
      title: 'Connection Rules in Angular Flow Diagrams',
      description:
        'Learn how to restrict and validate connections between nodes in Angular flow diagrams with Foblex Flow using IDs, categories, and visual feedback.',
      image: './previews/examples/connection-rules.light.png',
      imageDark: './previews/examples/connection-rules.dark.png',
      imageWidth: 1607,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },
  {
    slug: 'connectable-side',
    text: 'Connectable Side',
    group: 'Connectors',
    date: new Date('2025-09-29 14:17:29'),
    badge: { text: 'Updated', type: 'info' },
    seo: {
      title: 'Angular Diagram Connectors – Control Connectable Sides (Top, Right, Bottom, Left)',
      description:
        'Control how nodes connect by defining allowed sides (top, right, bottom, left) or using automatic calculation. Includes manual switching and dynamic side detection for Angular diagrams.',
      image: './previews/examples/connectable-side.light.png',
      imageDark: './previews/examples/connectable-side.dark.png',
      imageWidth: 1540,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },

  // -------- Connections - Editing --------
  {
    slug: 'drag-to-connect',
    text: 'Drag to Connect',
    group: 'Connections - Editing',
    date: new Date('2024-10-02 16:04:08'),
    seo: {
      title: 'Drag to Connect',
      description:
        'Let users create edges by dragging between ports. Validation, snapping and UX details with Angular code.',
      image: './previews/examples/drag-to-connect.light.png',
      imageDark: './previews/examples/drag-to-connect.dark.png',
      imageWidth: 806,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'drag-to-reassign',
    text: 'Drag to Reassign',
    group: 'Connections - Editing',
    date: new Date('2025-08-23 16:04:08'),
    seo: {
      title: 'Drag to Reassign',
      description:
        'Reassign connections by dragging edges to new nodes. Guard rules and smooth UX in Angular diagrams.',
      image: './previews/examples/drag-to-reassign.light.png',
      imageDark: './previews/examples/drag-to-reassign.dark.png',
      imageWidth: 806,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'create-node-on-connection-drop',
    text: 'Create Node on Connection Drop',
    group: 'Connections - Editing',
    date: new Date('2024-10-02 16:04:08'),
    seo: {
      title: 'Angular Workflow Builder Example – Create a Node on Connection Drop',
      description:
        'Create a new node when a dragged connection is dropped into empty space. A fast, product-style pattern for Angular workflow builders.',
      image: './previews/examples/create-node-on-connection-drop.light.png',
      imageDark: './previews/examples/create-node-on-connection-drop.dark.png',
      imageWidth: 791,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'remove-connection-on-drop',
    text: 'Remove Connection on Drop',
    group: 'Connections - Editing',
    date: new Date('2024-10-02 16:04:08'),
    seo: {
      title: 'Angular Diagram Example – Remove Connections on Drop',
      description:
        'Remove an existing connection as part of drag-and-drop editing. Useful for faster rewiring and cleaner Angular graph UX.',
      image: './previews/examples/remove-connection-on-drop.light.png',
      imageDark: './previews/examples/remove-connection-on-drop.dark.png',
      imageWidth: 791,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'assign-node-to-connection-on-drop',
    text: 'Assign Node to Connection on Drop',
    group: 'Connections - Editing',
    date: new Date('2024-12-30 15:26:54'),
    seo: {
      title: 'Angular Workflow Builder Example – Insert a Node into a Connection',
      description:
        'Drop a node onto an existing edge to insert it into the graph. A practical pattern for Angular workflow builders and AI pipelines.',
      image: './previews/examples/assign-node-to-connection-on-drop.light.png',
      imageDark: './previews/examples/assign-node-to-connection-on-drop.dark.png',
      imageWidth: 791,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'auto-snap',
    text: 'Auto Snap',
    group: 'Connections - Editing',
    date: new Date('2025-01-31 17:16:33'),
    seo: {
      title: 'Auto Snap',
      description:
        'Auto-snap connections to nearest ports or nodes. Magnetic behavior, UX tips and Angular example.',
      image: './previews/examples/auto-snap.light.png',
      imageDark: './previews/examples/auto-snap.dark.png',
      imageWidth: 781,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },

  // -------- Connections - Appearance --------
  {
    slug: 'connection-types',
    text: 'Connection Types (Straight, Segment, Bezier, Adaptive Curve)',
    group: 'Connections - Appearance',
    date: new Date('2025-10-12 20:12:01'),
    seo: {
      title:
        'Different Connection types in Foblex Flow Charts – Straight, Segment, Bezier, Adaptive Curve',
      description:
        'Explore different connection types in Angular diagrams: straight, segment, bezier, and adaptive curve. Learn how to adjust offset and radius, and discover when each type works best. Includes visuals and a guide for creating custom connection types.',
      image: './previews/examples/connection-types.light.png',
      imageDark: './previews/examples/connection-types.dark.png',
      imageWidth: 1596,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },
  {
    slug: 'custom-connection-type',
    text: 'Custom Connection Type',
    group: 'Connections - Appearance',
    date: new Date('2024-10-02 20:12:01'),
    seo: {
      title: 'Angular Diagram Example – Custom Connection Type in Foblex Flow',
      description:
        'Define a reusable custom connection type with its own rendering and interaction model. Useful when different edge classes carry different meaning.',
      image: './previews/examples/custom-connection-type.light.png',
      imageDark: './previews/examples/custom-connection-type.dark.png',
      imageWidth: 791,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'connection-behaviours',
    text: 'Connection Behaviours',
    group: 'Connections - Appearance',
    date: new Date('2024-10-03 00:50:53'),
    seo: {
      title: 'Angular Diagram Example – Custom Connection Behaviours',
      description:
        'Apply different behaviors to different connections in the same Angular editor. Useful for mixed graphs with strict and flexible edge rules.',
      image: './previews/examples/connection-behaviours.light.png',
      imageDark: './previews/examples/connection-behaviours.dark.png',
      imageWidth: 791,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'connection-markers',
    text: 'Connection Markers',
    group: 'Connections - Appearance',
    date: new Date('2024-10-06 14:49:44'),
    seo: {
      title: 'Connection Markers',
      description:
        'Use built-in or custom SVG connection markers, including normal and selected-state variants, in Angular flowcharts.',
      image: './previews/examples/connection-markers.light.png',
      imageDark: './previews/examples/connection-markers.dark.png',
      imageWidth: 791,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'connection-content',
    text: 'Connection Content',
    group: 'Connections - Appearance',
    date: new Date('2025-09-15 18:23:26'),
    badge: { text: 'Updated', type: 'info' },
    seo: {
      title: 'Angular Diagram Example – Connection Content on Edges',
      description:
        'Attach custom content (labels, icons, buttons) to diagram connections in Angular with Foblex Flow. Control position, offset and alignment for interactive flowcharts.',
      image: './previews/examples/connection-content.light.png',
      imageDark: './previews/examples/connection-content.dark.png',
      imageWidth: 1572,
      imageHeight: 1204,
      imageType: 'image/png',
    },
  },
  {
    slug: 'connection-gradients',
    text: 'Connection Gradients',
    group: 'Connections - Appearance',
    date: new Date('2026-03-11 12:00:00'),
    badge: { text: 'Updated', type: 'info' },
    seo: {
      title: 'Angular Diagram Example – Projected Connection Gradients',
      description:
        'Configure projected SVG gradients for Angular diagram connections and switch start/end colors live in a focused Foblex Flow example.',
      image: './previews/examples/custom-connections.light.png',
      imageDark: './previews/examples/custom-connections.dark.png',
      imageWidth: 791,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },

  // -------- Connections - Routing --------
  {
    slug: 'connection-waypoints',
    text: 'Connection Waypoints',
    group: 'Connections - Routing',
    date: new Date('2026-01-25 12:00:00'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title: 'Connection Waypoints in Foblex Flow – Add and Drag Waypoints for Any Connection Type',
      description:
        'Learn how to control connection routing with Waypoints in Angular diagrams. Add waypoints from candidates, drag them to reshape connections, and bind waypoint data via [(waypoints)]. Works with straight, segment, bezier, and adaptive-curve connections.',
      image: './previews/examples/connection-waypoints.light.png',
      imageDark: './previews/examples/connection-waypoints.dark.png',
      imageWidth: 1570,
      imageHeight: 1202,
      imageType: 'image/png',
    },
  },
  {
    slug: 'connection-connectable-side',
    text: 'Connection Connectable Side',
    group: 'Connections - Routing',
    date: new Date('2025-10-11 14:17:29'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title:
        'Angular Diagram Connections – Control Connection Sides (Top, Right, Bottom, Left, Calculate)',
      description:
        'Control how connections attach to nodes by defining start and end sides (top, right, bottom, left) or using automatic calculation modes. Demonstrates manual side switching and dynamic side determination for Angular diagrams.',
      image: './previews/examples/connection-connectable-side.light.png',
      imageDark: './previews/examples/connection-connectable-side.dark.png',
      imageWidth: 1596,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },

  // -------- Viewport --------
  {
    slug: 'minimap',
    text: 'Minimap',
    group: 'Viewport',
    date: new Date('2025-07-23 13:28:05'),
    seo: {
      title: 'Minimap',
      description:
        'Show a minimap to navigate large diagrams. Viewport sync, performance tips and Angular example.',
      image: './previews/examples/minimap-example.light.png',
      imageDark: './previews/examples/minimap-example.dark.png',
      imageWidth: 821,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'zoom',
    text: 'Zoom',
    group: 'Viewport',
    date: new Date('2026-01-25 00:00:00'),
    seo: {
      title: 'Zoom',
      description:
        'Zoom your canvas via mouse wheel, double click, buttons, and pinch-to-zoom (trackpad/touchscreen) with smooth limits and responsive UX.',
      image: './previews/examples/zoom.light.png',
      imageDark: './previews/examples/zoom.dark.png',
      imageWidth: 821,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'background',
    text: 'Background',
    group: 'Viewport',
    date: new Date('2025-11-29 14:49:44'),
    seo: {
      title: 'Background',
      description:
        'Add SVG background patterns to the flow diagrams in Angular, using built-in rect and circle presets or a fully custom pattern for complex, branded backgrounds.',
      image: './previews/examples/background-example.light.png',
      imageDark: './previews/examples/background-example.dark.png',
      imageWidth: 821,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'auto-pan',
    text: 'Auto Pan',
    group: 'Viewport',
    date: new Date('2026-03-26 13:00:00'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title: 'Auto Pan',
      description:
        'Pan the viewport automatically while dragging near the edge. Includes connection create/reassign, node drag, external items, and selection area.',
      image: './previews/examples/auto-pan.light.png',
      imageDark: './previews/examples/auto-pan.dark.png',
      imageWidth: 2120,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },
  {
    slug: 'canvas-layers',
    text: 'Canvas Layer Ordering',
    group: 'Viewport',
    date: new Date('2026-04-26 12:00:00'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title: 'Canvas Layer Ordering — Stack Groups, Connections, and Nodes in Any Order',
      description:
        'Reorder the three built-in canvas layers (groups, connections, nodes) per instance via [fLayers] or app-wide via withFCanvas. Configurable for tinted group overlays, edge-clickable connections, and custom render stacks.',
      image: './previews/examples/canvas-layers.light.png',
      imageDark: './previews/examples/canvas-layers.dark.png',
      imageWidth: 2116,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },

  // -------- Editor Helpers --------
  {
    slug: 'selection-area',
    text: 'Selection Area',
    group: 'Editor Helpers',
    date: new Date('2024-10-06 13:57:22'),
    seo: {
      title: 'Selection Area',
      description:
        'Add multi-select with a rubber-band box and keyboard modifiers. Accessibility and performance tips in Angular.',
      image: './previews/examples/selection-area.light.png',
      imageDark: './previews/examples/selection-area.dark.png',
      imageWidth: 821,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'magnetic-lines',
    text: 'Magnetic Lines',
    group: 'Editor Helpers',
    date: new Date('2026-02-15 12:00:00'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title: 'Angular Node Editor – Magnetic Snap Lines & Alignment Guides (Foblex Flow)',
      description:
        'Magnetic snap lines for Angular diagrams: align nodes by edges and centers while dragging. Clean UX, configurable thresholds, and a ready-to-use Foblex Flow example.',
      image: './previews/examples/magnetic-lines.light.png',
      imageDark: './previews/examples/magnetic-lines.dark.png',
      imageWidth: 1591,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },
  {
    slug: 'magnetic-rects',
    text: 'Magnetic Rects',
    group: 'Editor Helpers',
    date: new Date('2026-02-15 12:00:00'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title: 'Angular Node Editor – Equal Spacing Guides (Figma-Like) with Magnetic Rects',
      description:
        'Figma-like equal spacing for Angular diagrams. Magnetic rectangles visualize gaps and snap nodes to consistent spacing while keeping alignment lines. Includes configurable thresholds and a full Foblex Flow implementation.',
      image: './previews/examples/magnetic-rects.light.png',
      imageDark: './previews/examples/magnetic-rects.dark.png',
      imageWidth: 1591,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },
  {
    slug: 'grid-system',
    text: 'Grid System',
    group: 'Editor Helpers',
    date: new Date('2025-02-09 12:37:27'),
    seo: {
      title: 'Grid System',
      description:
        'Add a configurable grid with snapping for precise positioning. Lightweight Angular example and code.',
      image: './previews/examples/grid-system.light.png',
      imageDark: './previews/examples/grid-system.dark.png',
      imageWidth: 770,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'add-node-from-palette',
    text: 'Add Node from Palette',
    group: 'Editor Helpers',
    date: new Date('2025-02-09 12:37:27'),
    seo: {
      title: 'Add Node from Palette',
      description:
        'Drag nodes from an external palette into the canvas. Data binding, events and Angular implementation.',
      image: './previews/examples/add-node-from-palette.light.png',
      imageDark: './previews/examples/add-node-from-palette.dark.png',
      imageWidth: 781,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'help-in-positioning',
    text: 'Help in Positioning (Legacy)',
    group: 'Editor Helpers',
    date: new Date('2025-02-09 12:37:27'),
    badge: { text: 'Deprecated', type: 'danger' },
    seo: {
      title: 'Angular Diagram Example – Legacy Node Alignment Helpers (Deprecated)',
      description:
        'Legacy node alignment helper example kept for reference. For new projects, use Magnetic Lines and Magnetic Rects instead.',
      image: './previews/examples/help-in-positioning.light.png',
      imageDark: './previews/examples/help-in-positioning.dark.png',
      imageWidth: 821,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },

  // -------- Layout Engines --------
  {
    slug: 'dagre-layout',
    text: 'Dagre Layout',
    group: 'Layout Engines',
    date: new Date('2025-09-14 14:01:26'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title: 'Angular Dagre Graph Layout Example',
      description:
        'Build directed graph and tree layouts with Dagre in Angular. The example generates a graph from node count, recalculates links automatically, and re-runs manual layout on demand.',
      image: './previews/examples/dagre-layout.light.png',
      imageDark: './previews/examples/dagre-layout.dark.png',
      imageWidth: 2116,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },
  {
    slug: 'dagre-layout-auto',
    text: 'Dagre Auto Layout',
    group: 'Layout Engines',
    date: new Date('2026-04-09 12:00:00'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title: 'Angular Dagre Auto Layout Example',
      description:
        'Use Foblex Flow auto mode with Dagre in Angular. The example keeps app state as the source of truth, rebuilds the graph reactively, and lets auto relayout reposition nodes.',
      image: './previews/examples/dagre-layout-auto.light.png',
      imageDark: './previews/examples/dagre-layout-auto.dark.png',
      imageWidth: 2116,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },
  {
    slug: 'elkjs-layout',
    text: 'ELK.js Layout',
    group: 'Layout Engines',
    date: new Date('2025-02-08 14:01:26'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title: 'Angular ELK.js Graph Layout Example',
      description:
        'Generate layered graph layouts with ELK.js in Angular. The example rebuilds nodes and connections from one graph factory and applies manual layout direction changes through Foblex Flow.',
      image: './previews/examples/elkjs-layout.light.png',
      imageDark: './previews/examples/elkjs-layout.dark.png',
      imageWidth: 2116,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },
  {
    slug: 'elk-layout-auto',
    text: 'ELK.js Auto Layout',
    group: 'Layout Engines',
    date: new Date('2026-04-09 12:00:00'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title: 'Angular ELK.js Auto Layout Example',
      description:
        'Run ELK.js through Foblex Flow auto mode in Angular. The example rebuilds the source graph from component state and syncs calculated positions back with writeback.',
      image: './previews/examples/elk-layout-auto.light.png',
      imageDark: './previews/examples/elk-layout-auto.dark.png',
      imageWidth: 2116,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },

  // -------- Reflow --------
  {
    slug: 'reflow-on-resize',
    text: 'Reflow on Resize',
    group: 'Reflow',
    date: new Date('2026-04-25 12:00:00'),
    badge: { text: 'New', type: 'success' },
    seo: {
      title: 'Angular Diagram Example – Smart Auto-Layout on Resize with Foblex Flow',
      description:
        'Auto-shift neighbouring nodes when a node resizes or its content expands. Mode, scope, collision, axis, and delta-source — every option with a focused demo.',
      image: './previews/examples/reflow-on-resize.light.png',
      imageDark: './previews/examples/reflow-on-resize.dark.png',
      imageWidth: 2116,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },

  // -------- Editor State --------
  {
    slug: 'copy-paste',
    text: 'Cut/Copy/Paste',
    group: 'Editor State',
    date: new Date('2025-08-23 17:23:57'),
    seo: {
      title: 'Cut/Copy/Paste',
      description:
        'Implement cut/copy/paste for diagram nodes and connections. Clipboard format, serialization, and a ready-to-use Angular example.',
      image: './previews/examples/copy-paste.light.png',
      imageDark: './previews/examples/copy-paste.dark.png',
      imageWidth: 799,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'undo-redo',
    text: 'Undo/Redo',
    group: 'Editor State',
    date: new Date('2025-07-19 17:23:57'),
    seo: {
      title: 'Undo/Redo',
      description:
        'Undo/Redo basics for Angular diagrams. Snapshot patterns, node moves and connection restore with example.',
      image: './previews/examples/undo-redo.light.png',
      imageDark: './previews/examples/undo-redo.dark.png',
      imageWidth: 781,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'undo-redo-v2',
    text: 'Undo/Redo V2',
    group: 'Editor State',
    date: new Date('2025-08-23 17:23:57'),
    seo: {
      title: 'Undo/Redo V2',
      description:
        'Undo/Redo with @foblex/mutator: state snapshots, revert node moves, restore connections. Patterns and demo.',
      image: './previews/examples/undo-redo-v2.light.png',
      imageDark: './previews/examples/undo-redo-v2.dark.png',
      imageWidth: 799,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },

  // -------- Events --------
  {
    slug: 'drag-start-end-events',
    text: 'Drag Start/End Events',
    group: 'Events',
    date: new Date('2025-02-08 14:01:26'),
    seo: {
      title: 'Angular Diagram Example – Drag Start and End Events',
      description:
        'Track drag start and end events for nodes and edges in Angular. Useful for helper UI, analytics, and external state coordination.',
      image: './previews/examples/drag-start-end-events.light.png',
      imageDark: './previews/examples/drag-start-end-events.dark.png',
      imageWidth: 781,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },
  {
    slug: 'custom-event-triggers',
    text: 'Custom Event Triggers',
    group: 'Events',
    date: new Date('2025-02-10 19:00:00'),
    seo: {
      title: 'Custom Event Triggers',
      description:
        'Create custom event triggers for diagram interactions. Hooks, callbacks and Angular example code.',
      image: './previews/examples/custom-event-triggers.light.png',
      imageDark: './previews/examples/custom-event-triggers.dark.png',
      imageWidth: 802,
      imageHeight: 600,
      imageType: 'image/png',
    },
  },

  // -------- Performance --------
  {
    slug: 'stress-test',
    text: 'Large Scene Performance',
    group: 'Performance',
    date: new Date('2026-03-09 12:00:00'),
    seo: {
      title:
        'Angular Diagram Performance Example – Large Scene Performance with Cache and Virtualization',
      description:
        'Measure large scene performance with 200 to 5000 nodes, optional cache, progressive virtualization, and toggleable connections in Angular Foblex Flow.',
      image: './previews/examples/stress-test.light.png',
      imageDark: './previews/examples/stress-test.dark.png',
      imageWidth: 2140,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },
  {
    slug: 'stress-test-with-connections',
    text: 'Connection Redraw Performance',
    group: 'Performance',
    date: new Date('2026-03-09 12:00:00'),
    badge: { text: 'Updated', type: 'info' },
    seo: {
      title: 'Angular Flowchart Performance Example – Connection Redraws and Routing Modes',
      description:
        'Measure dense fan-out connection redraws with switchable behaviors, path types, live updates, and custom markers in an Angular Foblex Flow example.',
      image: './previews/examples/stress-test-with-connections.light.png',
      imageDark: './previews/examples/stress-test-with-connections.dark.png',
      imageWidth: 2140,
      imageHeight: 1200,
      imageType: 'image/png',
    },
  },

  // -------- Reference Apps --------
  {
    slug: 'ai-low-code-platform',
    text: 'AI Low-Code Platform',
    group: 'Reference Apps',
    date: new Date('2026-03-09 12:00:00'),
    badge: { text: 'Updated', type: 'info' },
    seo: {
      title: 'Angular AI Low-Code IDE Example – Flagship Product-Style Demo with Foblex Flow',
      description:
        'Flagship front-end-only AI low-code IDE demo in Angular with custom nodes, JSON import/export, multiple themes, right-side config panels, validation reflected on nodes, undo/redo, persistence, multi-select, and animated connections.',
      image: './previews/examples/ai-low-code.light.png',
      imageDark: './previews/examples/ai-low-code.dark.png',
      imageWidth: 3700,
      imageHeight: 2080,
      imageType: 'image/png',
    },
  },
  {
    slug: 'schema-designer',
    text: 'Schema Designer',
    group: 'Reference Apps',
    badge: { text: 'Updated', type: 'info' },
    seo: {
      title: 'Schema Designer',
      description:
        'Interactive schema modeler with table nodes, inline column editing, relation toolbars, context menus, selection area, and minimap.',
      image: './previews/examples/db-management-flow.light.png',
      imageDark: './previews/examples/db-management-flow.dark.png',
      imageWidth: 2102,
      imageHeight: 1194,
      imageType: 'image/png',
    },
  },
  {
    slug: 'call-center',
    text: 'Call Center Flow',
    group: 'Reference Apps',
    badge: { text: 'Updated', type: 'info' },
    seo: {
      title: 'Angular Call Center Flow Builder Example – IVR, Queue, Transfer, and Voicemail',
      description:
        'Call-center flow builder with IVR branches, schedule checks, queueing, operator handoff, transfer, voicemail, palette-driven node creation, and minimap navigation.',
      image: './previews/examples/call-center.light.png',
      imageDark: './previews/examples/call-center.dark.png',
      imageWidth: 2078,
      imageHeight: 1194,
      imageType: 'image/png',
    },
  },
  {
    slug: 'uml-diagram-example',
    text: 'UML Diagram',
    group: 'Reference Apps',
    badge: { text: 'Updated', type: 'info' },
    seo: {
      title: 'UML Diagram',
      description:
        'Layered UML surface with package groups, relation filters, search, custom markers, details panel, and viewport controls.',
      image: './previews/examples/uml-diagram-example.light.png',
      imageDark: './previews/examples/uml-diagram-example.dark.png',
      imageWidth: 2108,
      imageHeight: 1194,
      imageType: 'image/png',
    },
  },
  {
    slug: 'tournament-bracket',
    text: 'Tournament Bracket',
    group: 'Reference Apps',
    badge: { text: 'Updated', type: 'info' },
    seo: {
      title: 'Tournament Bracket',
      description:
        'Tournament bracket demo with multiple layout strategies, bracket visibility filters, match drill-down, team stats, and minimap.',
      image: './previews/examples/tournament-bracket.light.png',
      imageDark: './previews/examples/tournament-bracket.dark.png',
      imageWidth: 2102,
      imageHeight: 1194,
      imageType: 'image/png',
    },
  },
];

/**
 * Components used by examples markdown via custom container syntax.
 *
 * Kept at section level — each entry could be moved to its owning page,
 * but mass per-page co-location requires inspecting every .md and is out of
 * scope for this migration.
 */
export const EXAMPLES_COMPONENTS = [
  defineLazyComponent(
    'canvas-layers',
    () => import('@foblex/examples/extensions/canvas-layers/example'),
  ),
  defineLazyComponent('custom-nodes', () => import('@foblex/examples/nodes/custom-nodes/example')),
  defineLazyComponent('drag-handle', () => import('@foblex/examples/nodes/drag-handle/example')),
  defineLazyComponent(
    'resize-handle',
    () => import('@foblex/examples/nodes/resize-handle/example'),
  ),
  defineLazyComponent(
    'rotate-handle',
    () => import('@foblex/examples/nodes/rotate-handle/example'),
  ),
  defineLazyComponent('grouping', () => import('@foblex/examples/nodes/grouping/example')),
  defineLazyComponent(
    'drag-to-group',
    () => import('@foblex/examples/nodes/drag-to-group/example'),
  ),
  defineLazyComponent('stress-test', () => import('@foblex/examples/nodes/stress-test/example')),
  defineLazyComponent(
    'stress-test-with-connections',
    () => import('@foblex/examples/nodes/stress-test-with-connections/example'),
  ),
  defineLazyComponent(
    'node-selection',
    () => import('@foblex/examples/nodes/node-selection/example'),
  ),
  defineLazyComponent(
    'node-as-connector',
    () => import('@foblex/examples/connectors/node-as-connector/example'),
  ),
  defineLazyComponent(
    'connector-inside-node',
    () => import('@foblex/examples/connectors/connector-inside-node/example'),
  ),
  defineLazyComponent(
    'connector-outlet',
    () => import('@foblex/examples/connectors/connector-outlet/example'),
  ),
  defineLazyComponent(
    'limiting-connections',
    () => import('@foblex/examples/connectors/limiting-connections/example'),
  ),
  defineLazyComponent(
    'connection-rules',
    () => import('@foblex/examples/connectors/connection-rules/example'),
  ),
  defineLazyComponent(
    'connectable-side',
    () => import('@foblex/examples/connectors/connectable-side/example'),
  ),
  defineLazyComponent(
    'drag-to-connect',
    () => import('@foblex/examples/connections/drag-to-connect/example'),
  ),
  defineLazyComponent(
    'drag-to-reassign',
    () => import('@foblex/examples/connections/drag-to-reassign/example'),
  ),
  defineLazyComponent(
    'create-node-on-connection-drop',
    () => import('@foblex/examples/connections/create-node-on-connection-drop/example'),
  ),
  defineLazyComponent(
    'remove-connection-on-drop',
    () => import('@foblex/examples/connections/remove-connection-on-drop/example'),
  ),
  defineLazyComponent(
    'assign-node-to-connection-on-drop',
    () => import('@foblex/examples/connections/assign-node-to-connection-on-drop/example'),
  ),
  defineLazyComponent('auto-snap', () => import('@foblex/examples/connections/auto-snap/example')),
  defineLazyComponent(
    'connection-types',
    () => import('@foblex/examples/connections/connection-types/example'),
  ),
  defineLazyComponent(
    'connection-waypoints',
    () => import('@foblex/examples/connections/connection-waypoints/example'),
  ),
  defineLazyComponent(
    'custom-connection-type',
    () => import('@foblex/examples/connections/custom-connection-type/example'),
  ),
  defineLazyComponent(
    'connection-behaviours',
    () => import('@foblex/examples/connections/connection-behaviours/example'),
  ),
  defineLazyComponent(
    'connection-markers',
    () => import('@foblex/examples/connections/connection-markers/example'),
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
    'connection-connectable-side',
    () => import('@foblex/examples/connections/connection-connectable-side/example'),
  ),
  defineLazyComponent(
    'dagre-layout',
    () => import('@foblex/examples/plugins/f-layout/dagre-layout/example'),
  ),
  defineLazyComponent(
    'dagre-layout-auto',
    () => import('@foblex/examples/plugins/f-layout/dagre-layout-auto/example'),
  ),
  defineLazyComponent(
    'elk-layout',
    () => import('@foblex/examples/plugins/f-layout/elk-layout/example'),
  ),
  defineLazyComponent(
    'elk-layout-auto',
    () => import('@foblex/examples/plugins/f-layout/elk-layout-auto/example'),
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
    'reflow-scope',
    () => import('@foblex/examples/plugins/reflow-on-resize/scope/example'),
  ),
  defineLazyComponent(
    'reflow-collision',
    () => import('@foblex/examples/plugins/reflow-on-resize/collision/example'),
  ),
  defineLazyComponent(
    'reflow-delta-source',
    () => import('@foblex/examples/plugins/reflow-on-resize/delta-source/example'),
  ),
  defineLazyComponent(
    'reflow-axis',
    () => import('@foblex/examples/plugins/reflow-on-resize/axis/example'),
  ),
  defineLazyComponent(
    'reflow-pattern-live',
    () => import('@foblex/examples/plugins/reflow-on-resize/pattern-live-controller/example'),
  ),
  defineLazyComponent(
    'selection-area',
    () => import('@foblex/examples/extensions/selection-area/example'),
  ),
  defineLazyComponent('auto-pan', () => import('@foblex/examples/extensions/auto-pan/example')),
  defineLazyComponent(
    'help-in-positioning',
    () => import('@foblex/examples/extensions/help-in-positioning/example'),
  ),
  defineLazyComponent(
    'magnetic-lines',
    () => import('@foblex/examples/extensions/magnetic-lines/example'),
  ),
  defineLazyComponent(
    'magnetic-rects',
    () => import('@foblex/examples/extensions/magnetic-rects/example'),
  ),
  defineLazyComponent('zoom', () => import('@foblex/examples/extensions/zoom/example')),
  defineLazyComponent(
    'minimap-example',
    () => import('@foblex/examples/extensions/minimap-example/example'),
  ),
  defineLazyComponent(
    'background-example',
    () => import('@foblex/examples/extensions/background-example/example'),
  ),
  defineLazyComponent(
    'schema-designer',
    () => import('../../features/reference-app-previews/schema-designer-preview'),
  ),
  defineLazyComponent(
    'call-center',
    () => import('../../features/reference-app-previews/call-center-preview'),
  ),
  defineLazyComponent(
    'uml-diagram-example',
    () => import('../../features/reference-app-previews/uml-diagram-example-preview'),
  ),
  defineLazyComponent(
    'tournament-bracket',
    () => import('../../features/reference-app-previews/tournament-bracket-preview'),
  ),
  defineLazyComponent(
    'grid-system',
    () => import('@foblex/examples/extensions/grid-system/example'),
  ),
  defineLazyComponent('copy-paste', () => import('@foblex/examples/advanced/copy-paste/example')),
  defineLazyComponent('undo-redo', () => import('@foblex/examples/advanced/undo-redo/example')),
  defineLazyComponent(
    'undo-redo-v2',
    () => import('@foblex/examples/advanced/undo-redo-v2/example'),
  ),
  defineLazyComponent(
    'add-node-from-palette',
    () => import('@foblex/examples/extensions/add-node-from-palette/example'),
  ),
  defineLazyComponent(
    'drag-start-end-events',
    () => import('@foblex/examples/advanced/drag-start-end-events/example'),
  ),
  defineLazyComponent(
    'custom-event-triggers',
    () => import('@foblex/examples/advanced/custom-event-triggers/example'),
  ),
  defineLazyComponent(
    'ai-low-code-platform',
    () => import('@foblex/examples/external-apps/ai-low-code-platform/ai-low-code-platform'),
  ),
];
