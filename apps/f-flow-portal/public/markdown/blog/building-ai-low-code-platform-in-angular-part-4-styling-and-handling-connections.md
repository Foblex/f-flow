---
origin: "https://javascript.plainenglish.io/building-ai-low-code-platform-in-angular-part-4-styling-and-handling-connections-79e1ef769a5d"
originLabel: "Originally published on JavaScript in Plain English"
publishedAt: "2025-08-06"
updatedAt: "2026-03-08"
---

# Building AI Low-Code Platform in Angular — Part 4: Styling and Handling Connections

In the previous part, we brought our node editor to life with custom components and a dynamic palette. This article focuses on the next layer: how connections behave, how they look, and how much control users have while editing them.

Today, we’re upgrading our flow with some serious UX polish:

- 🔁 Enable dynamic reattachment of connections (drag to reconnect!)
- 🏁 Style connections with sleek SVG markers
- ✨ Add hover highlights and interactivity

Let’s turn static lines into smart, responsive connectors and give the editor the interaction quality users expect from a production workflow builder.

![](https://cdn-images-1.medium.com/max/1024/1*UUQTSP7q7aDNWBhh-zhGnw.png)

> 🔧 [View the source code on GitHub](https://github.com/Foblex/Building-AI-Low-Code-Platform4)

### 🔁 **Reattaching Connections**

Connections in Foblex Flow aren’t just static wires — they’re fully interactive and reconfigurable. Each end of a connection features a *drag handle* — an invisible area you can grab to change where the connection starts or ends.

::: ng-component <drag-to-reassign></drag-to-reassign> [height]="600"
:::

By default, only the **target end** ([input](https://flow.foblex.com/docs/f-node-input-directive)) is draggable. But you can also make the **source end** ([output](https://flow.foblex.com/docs/f-node-output-directive)) reassignable by setting the fReassignableStart=”true” input. This gives you precise control over which ends can be modified — on a **per-connection** basis.

::: ng-component <drag-to-reassign></drag-to-reassign> [height]="600"
:::

Want to rewire a connection? Just drag one of its ends and drop it onto another connector. [Foblex Flow](https://flow.foblex.com/) takes care of the rest — when the drag operation finishes, it emits the fReassignConnection event from the \<f-flow> component itself (not from the connection element):

```html
<f-flow fDraggable
        (fCreateNode)="createNode($event)"
        (fCreateConnection)="createConnection($event)"
        (fReassignConnection)="reassignConnection($event)"> // This event is emitted from fDraggable, not from f-connection itself
</f-flow>
```

This event contains everything you need to handle the reattachment:

```ts
class FReassignConnectionEvent {
  connectionId: string;
  isSourceReassign: boolean;
  isTargetReassign: boolean;
  oldSourceId: string;
  newSourceId: string | undefined;
  oldTargetId: string;
  newTargetId: string | undefined;
  dropPoint: IPoint;
}
```

🧠 **Tip:**

The event will still be triggered even if the user doesn’t drop the connection onto another connector. In that case, newTargetId (or newSourceId) will be undefined, but you’ll still receive the exact dropPoint — the canvas coordinates where the user released the connection.

This is extremely useful if you want to open a context menu or create a new node on the fly at that position.

Here’s how to update your connection list when the target changes:

```ts
protected reassignConnection(event: FReassignConnectionEvent): void {
  if (!event.newTargetId) {
    return;
  }
  this.connections.update((connections) => {
    const connection = connections.find(c => c.id === event.connectionId);
    if(!connection) {
      throw new Error(`Connection ${event.connectionId} not found`);
    }
    connection.to = event.newTargetId;
    return [...connections];
  });
}
```

That’s it — your users can now interactively rewire the flow by grabbing connection ends and reattaching them wherever they need. It’s a small feature, but it makes the editor feel **dynamic**, **intuitive**, and **alive**.

<https://flow.foblex.com/examples/drag-to-reassign>

### 🧬 **Connection Types and Behaviors**

Connections in [Foblex Flow](https://flow.foblex.com/) aren’t just visual lines — they’re deeply customizable and behave exactly how you want them to.

Let’s start with the **three connection types**, each offering a different visual style:

- straight — a simple straight line
- segment — a segmented line with right angles (ideal for logic-style editors)
- bezier — a smooth, curved Bézier path

::: ng-component <connection-types></connection-types> [height]="600"
:::

<https://flow.foblex.com/examples/connection-types>

Next, you can define how the connection _behaves_ when linking nodes:

- fixed — connects from a specific side (left, right, top, bottom) defined via fConnectableSide
- fixed_center — connects from the exact center of each node
- floating — auto-calculates the intersection between the node’s shape and the imaginary line between node centers (great for circular or irregular shapes)

::: ng-component <connection-behaviours></connection-behaviours> [height]="600"
:::

Connection Behaviours

<https://flow.foblex.com/examples/connection-behaviours>

These options give you total control over both aesthetics and logic — whether you’re building a chatbot flow, a wiring diagram, or an AI pipeline.

📖 Want to dive deeper into all behaviors and visuals?

👉 [Read the full documentation](https://flow.foblex.com/docs/f-connection-component)

In our low-code platform, we’ll use a **Bézier curve** with a **fixed side behavior**, which feels natural for horizontal flow layouts:

```html
<f-connection [fConnectionId]="connection.id"
              fBehavior="fixed"
              fType="bezier"
              [fOutputId]="connection.from"
              [fInputId]="connection.to" />
```

You’re now in control — not just of where your connections go, but _how they feel_ when they get there.

### 🏁 Adding SVG Markers to Connections

A great UI isn’t just about layout — it’s about **clarity** and **direction**. When working with connections, nothing communicates intent better than **directional markers**.

With [Foblex Flow](https://flow.foblex.com/), you can attach **custom SVG markers** to the **start** or **end** of any connection. These can be arrows, dots, diamonds — anything you can draw in SVG.

::: ng-component <connection-markers></connection-markers> [height]="600"
:::

<https://flow.foblex.com/examples/connection-markers>

Here’s a minimal example that adds a simple circle to the **start** of a connection:

```html
<f-connection [fOutputId]="id1" [fInputId]="id2">
  <svg fMarker type="f-connection-marker-start"
       [height]="10" [width]="10" [refX]="5" [refY]="5">
    <circle cx="5" cy="5" r="2" fill="var(--connection-color)" />
  </svg>
</f-connection>
```

#### 📌[fMarker](https://flow.foblex.com/docs/f-connection-marker-directive) input parameters:

- type — the marker type
- width, height — size of the marker viewport
- refX, refY — anchoring point (where the marker attaches to the connection)

All marker types are defined in the [EFMarkerType](https://flow.foblex.com/docs/f-connection-marker-directive) enum:

```ts
enum EFMarkerType {
  START,
  END,
  SELECTED_START,
  SELECTED_END,
}
```

You can style markers differently for selected states — this is great for showing hover, focus, or active connections.

Here’s a full example that applies **all four types of markers** on a connection:

```ts
protected readonly eMarkerType = EFMarkerType;
```

```html
<f-connection [fConnectionId]="connection.id"
              fBehavior="fixed"
              fType="bezier"
              [fOutputId]="connection.from"
              [fInputId]="connection.to">
  <svg viewBox="0 0 10 10" fMarker [type]="eMarkerType.START" [height]="10" [width]="10" [refX]="5" [refY]="5">
    <circle cx="5" cy="5" r="2" fill="var(--connection-color)" />
  </svg>
  <svg viewBox="0 0 700 700" fMarker [type]="eMarkerType.END" [height]="5" [width]="5" [refX]="4" [refY]="2.5">
    <path fill="var(--connection-color)" d="M0,0L700,350L0,700L150,350z" />
  </svg>
  <svg viewBox="0 0 10 10" fMarker [type]="eMarkerType.SELECTED_START" [height]="10" [width]="10" [refX]="5" [refY]="5">
    <circle cx="5" cy="5" r="2" fill="var(--connection-color)" />
  </svg>
  <svg viewBox="0 0 700 700" fMarker [type]="eMarkerType.SELECTED_END" [height]="5" [width]="5" [refX]="4" [refY]="2.5">
    <path fill="var(--connection-color)" d="M0,0L700,350L0,700L150,350z" />
  </svg>
</f-connection>
```

With just a few lines of SVG, your connections can now **clearly show direction**, **communicate selection**, and make the entire UI feel more polished and understandable.

Next, we’ll make them glow ✨

### 🎨 **Styling Connections and Markers**

Let’s make our connections not just smart — but **stylish**.

First, we’ll define a custom CSS variable** — connection-color** and apply it to both the stroke of the connection path and the fill of any SVG markers. This way, all visual elements stay perfectly in sync.

```scss
::ng-deep {
  .f-connection {
    --connection-color: rgba(60, 60, 67); // default line color

    &.f-selected {
      --connection-color: #3451b2; // highlighted color on selection
    }

    .f-connection-drag-handle {
      fill: transparent; // invisible grab area for reattachment
    }

    .f-connection-selection {
      stroke-width: 10; // makes the selection area easier to hit
    }

    .f-connection-path {
      stroke: var(--connection-color); // applies the CSS variable
      stroke-width: 2;
    }
  }
}
```

💡 **Why use CSS variables?**

They allow you to easily **switch themes**, support dark/light mode, or dynamically update styles on interaction — without touching the DOM.

### 👆 **Hover Effect**

Now let’s make our connections respond to user interaction. A subtle glow on hover helps users understand that a line is clickable or draggable.

```scss
.f-connection-selection {
  stroke-width: 15;

  &:hover {
    stroke: rgba(52, 81, 178, 0.1);
  }
}
```

Just like that, your editor starts to feel **alive** — reacting to user input in a smooth, intuitive way.

### ✅ Done!

At this point, your connections are no longer just lines between nodes — they’re **fully interactive**, **visually expressive**, and **ready for production use**.

Here’s what we’ve achieved in this part:

✅ Enabled reattachment of connections with intuitive drag handles

✅ Supported reconnection from either side of the link

✅ Styled connection paths using CSS variables for easy theming

✅ Added SVG markers to visualize direction and selection

✅ Enhanced the UX with hover effects and visual feedback

Together, these improvements make a massive difference in how your flow editor _feels_ to the user. Small touches like directional arrows or soft highlights can turn a technical tool into a truly enjoyable experience.

But we’re not stopping here.

Up next, we’ll take interactivity to the next level by adding a **side panel** that appears when a node is selected. This panel will allow users to:

- View and edit node parameters dynamically
- Bind controls to schema-driven forms
- See changes reflected live in the flow

This is a huge step toward building a **real low-code platform**, where users don’t just connect logic — they **configure** and **control** it through a seamless UI.

## 🙌 Thanks for Your Interest

If you like the project — leave a ⭐ on GitHub, join the discussions, and share your feedback!
