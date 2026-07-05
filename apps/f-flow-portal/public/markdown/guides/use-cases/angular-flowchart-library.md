---
publishedAt: "2026-07-05"
updatedAt: "2026-07-05"
---

# Angular Flowchart Library

Foblex Flow is an Angular-native flowchart library for **editable** flowcharts: users drag steps, wire them together, and your application decides what the chart means. If you only need to render a static flowchart from text, a generator like Mermaid is the simpler tool — this library is for flowcharts that behave like a product feature.

## When to use it

- Process and approval flows users assemble themselves
- Decision trees and branching logic editors
- Automation and pipeline charts with live state
- Call flows, chatbot flows, onboarding flows
- Any flowchart where boxes are real UI, not just labeled shapes

## What a flowchart needs, covered

- Steps: any Angular component becomes a flowchart node with `fNode` — forms, icons, status badges, menus inside.
- Arrows: `<f-connection>` with straight/segment/bezier paths, markers, labels and editable waypoints.
- Wiring: users create connections by drag, by click-to-connect, or entirely from the keyboard; your validation rules decide what is allowed to connect.
- Reading order: minimap, zoom, fit-to-screen, auto-pan at the edges.
- Tidiness: snapping, alignment guides, grid, and automatic layout via the Dagre/ELK packages for one-click arrangement.
- Scale: virtualization and caching when charts grow into hundreds of steps.
- Accessibility: ARIA semantics by default; an opt-in keyboard layer makes the whole chart operable without a mouse.

## Compared to the usual suspects

- Abandoned Angular flowchart packages (ng-flowchart, ngx-flowchart) stopped receiving updates years ago; Foblex Flow ships frequent releases and targets current Angular.
- Chart libraries (ngx-charts and friends) draw data, not editors — no dragging, no wiring, no editing events.
- Big commercial diagram suites bring their own data model and licensing; here the chart stays your data, the library only emits events, and everything is MIT.

## Minimal flowchart

```bash
ng add @foblex/flow
```

```html
<f-flow fDraggable (fCreateConnection)="onConnect($event)">
  <f-canvas>
    @for (step of steps(); track step.id) {
      <div fNode fDragHandle [fNodeId]="step.id" [fNodePosition]="step.position">
        {{ step.title }}
        <div fConnector fConnectorId="step.id + '-in'" fConnectorType="target"></div>
        <div fConnector fConnectorId="step.id + '-out'" fConnectorType="source"></div>
      </div>
    }
    @for (arrow of arrows(); track arrow.id) {
      <f-connection [fConnectionId]="arrow.id" [fSourceId]="arrow.from" [fTargetId]="arrow.to">
        <f-connection-marker-arrow />
      </f-connection>
    }
  </f-canvas>
</f-flow>
```

Continue with [Get Started](./docs/get-started), or open the [Call Center](./examples/call-center) and [AI Low-Code Platform](./examples/ai-low-code-platform) demos — both are flowchart editors underneath.
