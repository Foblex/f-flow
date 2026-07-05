---
publishedAt: "2026-07-05"
updatedAt: "2026-07-05"
---

# One Connector Instead of Three: The Design Behind the Unified fConnector Model

This article explains why Foblex Flow v19 replaces the `fNodeInput` / `fNodeOutput` / `fNodeOutlet` trio with a single `[fConnector]` directive, what the unified model actually changes, and how the migration is designed to cost you nothing until you choose to pay it.

The legacy connector API was not wrong — it grew. First outputs and inputs, then outlets for nodes that start connections from one shared surface. Three directives, and with them a set of problems that kept showing up in real projects:

- Three id namespaces. The same string could legally be an input id **and** an output id, and resolution depended on which registry you asked.
- Asymmetric options: outputs had `fCanBeConnectedInputs`, inputs had their own gates, outlets had a third shape. Learning one directive taught you little about the next.
- A node that should both accept and start connections needed two overlapping elements at the same coordinates — a template hack for a modeling concept.
- Every new feature (categories, sides, limits) had to be added three times and documented three times.

## 🎯 The Key Idea: Behavior Is a Property, Not a Directive

The unified model collapses the trio into one directive where the connector's role is data:

```html
<div fConnector fConnectorType="source" fConnectorId="out-1"></div>
<div fConnector fConnectorType="target" fConnectorId="in-1"></div>
<div fConnector fConnectorId="port-1"></div> <!-- source-target: both, one element -->
```

- `fConnectorType` decides the behavior: `source`, `target`, `source-target` (the default), or `outlet`.
- One id per connector, unique across all types. No more double-registry ambiguity.
- One option set for everyone: `fConnectorDisabled`, `fConnectorMultiple`, `fConnectorCategory`, `fConnectorConnectableSide`, `fCanBeConnectedTo`.
- Neutral `.f-connector*` CSS classes and `data-f-connector-*` attributes.

The `source-target` default is the part I care about most. A port that both accepts and starts connections is the _normal_ case in half the editors people build — schema designers, state machines, mind maps — and it used to be the awkward one. Now it is one element with no configuration at all.

Connections follow the same cleanup: `f-connection` gets canonical `fSourceId` / `fTargetId` inputs, because "output" and "input" described the legacy directives, not the edge itself.

> 📌 In short: a connector is a place on a node where edges attach. What it may do there is configuration, not taxonomy.

## ⚡ What Did Not Change

The outlet semantics survived intact — an outlet is still a shared start surface, and the emitted `FCreateConnectionEvent.sourceId` is always the resolved real source id, never the outlet's. If your app never told the difference, it still can't.

And the boundary holds: the library stores only what it needs for interactivity and rendering. Connector ids are your vocabulary; the graph they describe stays in your application. Nothing about the unified model asks you to restructure your data.

## 🛠 Migration by Deprecation, Not by Break

Nothing is removed in v19. The design goal for the migration was: upgrading must be free, migrating must be incremental.

- `fNodeInput` / `fNodeOutput` / `fNodeOutlet` keep working, marked deprecated.
- `fOutputId` / `fInputId` (and the side inputs) keep working on `f-connection`; when both old and new are set, the new one wins.
- `fCanBeConnectedInputs` → `fCanBeConnectedTo` — a rename with a wider meaning, since targets are no longer only "inputs".

Two behavioral notes deserve attention when you migrate a connector:

1. `[fConnector]` defaults to `fConnectorMultiple = true`. Legacy outputs were single-connection by default. If you relied on that, set `fConnectorMultiple="false"` explicitly.
2. Ids are unique across all connector types. If a legacy node reused one string for its input and its output, give one of them a new id.

That is the whole list. The rest is find-and-replace at whatever pace suits the codebase.

::: ng-component <unified-connector></unified-connector> [height]="600"
:::

## 🧠 Why This Mattered Enough for a Major

APIs accumulate shape from their history, and at some point the history costs more than the cleanup. Three connector directives meant three of everything downstream — resolution paths, class names, docs pages, mental models. v19 was the right moment because the same release opened up gestures and the keyboard: every new way to drive the editor multiplies the cost of every redundant concept underneath it.

One connector model is less to learn, less to document, and — the part you'll notice — less to debug.

## 🚀 Conclusion

- Docs: <https://flow.foblex.com/docs/f-connector-directive>
- Live example: <https://flow.foblex.com/examples/unified-connector>
- The release it shipped in: <https://flow.foblex.com/blog/foblex-flow-v19-0-0-control-schemes-click-to-connect-keyboard-accessibility-and-a-unified-connector-model>

If you're building a visual editor in Angular and want a native Angular solution (not a React wrapper) — take a look.

And if you like what I'm building, please consider starring the repo ⭐

It helps the project a lot.
