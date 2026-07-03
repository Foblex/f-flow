# Connection Rules

Connection rules let you **restrict which inputs can accept a connection** from a specific **output** or **outlet**.

Instead of letting users connect anything to anything, you can declare an allow‑list directly on the _source connector_ and the library will:

- highlight only valid targets during drag,
- block invalid targets from being connected,
- reduce “invalid graph” states caused by user mistakes.

> Connection rules are a **UX guardrail**. Your app should still validate and persist the final graph state.

> **API note (v19+).** On the unified [`fConnector`](f-connector-directive) directive the allow-list input is called `fCanBeConnectedTo`, and targets are matched by `fConnectorId` / `fConnectorCategory`. The legacy `fCanBeConnectedInputs` input on `fNodeOutput` / `fNodeOutlet` is **deprecated** but keeps working. The matching semantics below are the same for both APIs.

## How it works

Rules are defined on **source connectors**:

- [`fConnector`](f-connector-directive) with type `source`, `source-target`, or `outlet` — via `fCanBeConnectedTo: string[]`
- [`fNodeOutput`](f-node-output-directive) / [`fNodeOutlet`](f-node-outlet-directive) _(deprecated)_ — via `fCanBeConnectedInputs: string[]`

During drag-to-connect, the library checks each candidate target connector and considers it connectable when **either** matches:

- the target id (`fConnectorId`, legacy `fInputId`)
- the target category (`fConnectorCategory`, legacy `fInputCategory`) — if you use categories

## Quick start

### Allow only one specific target (by id)

```html
<div
  fConnector
  fConnectorType="source"
  fConnectorId="out-1"
  [fCanBeConnectedTo]="['input-approve']"
>
  Output
</div>

<div fConnector fConnectorType="target" fConnectorId="input-approve">Approve</div>
<div fConnector fConnectorType="target" fConnectorId="input-reject">Reject</div>
```

Only `input-approve` can be targeted.

### Allow a whole class of targets (by category)

```html
<div
  fConnector
  fConnectorType="source"
  fConnectorId="out-1"
  [fCanBeConnectedTo]="['A']"
>
  Output
</div>

<div fConnector fConnectorType="target" fConnectorId="input-1" fConnectorCategory="A">Category A</div>
<div fConnector fConnectorType="target" fConnectorId="input-2" fConnectorCategory="B">Category B</div>
```

Only targets with `fConnectorCategory="A"` are valid.

## Naming conventions for the allow-list

`fCanBeConnectedTo` (legacy `fCanBeConnectedInputs`) is a simple allow-list of **strings**.  
Each string can be interpreted as either:

- a concrete **target id** (`fConnectorId`, legacy `fInputId`)
- or a **target category** (`fConnectorCategory`, legacy `fInputCategory`)

Because both are plain strings, you should adopt a convention to avoid accidental collisions
(when some target id equals a category name).

### Recommended convention

Use **prefixes**:

- `id:<inputId>` — for a specific input
- `cat:<category>` — for a category

Example:

```html
<div
  fConnector
  fConnectorType="source"
  fConnectorId="out-1"
  [fCanBeConnectedTo]="['id:input1', 'cat:A']"
>
  Output
</div>
```

And on the targets:

```html
<div fConnector fConnectorType="target" fConnectorId="input1" fConnectorCategory="B">Input input1</div>
<div fConnector fConnectorType="target" fConnectorId="input2" fConnectorCategory="A">Input A</div>
```

### If you don't want prefixes

You can also enforce “no overlap” by policy:

- target ids are always like `input:<name>` or `in-<number>`
- categories are always like `CAT_<name>` or `type:<name>`

The key point is: **make ids and categories visually distinct** so allow-lists are readable and safe.

## API

### Source-side input

- `fCanBeConnectedTo: string[];`  
  Declared on `[fConnector]` (types `source`, `source-target`, `outlet`).

- `fCanBeConnectedInputs: string[];` _(deprecated)_  
  Declared on `[fNodeOutput]` and `[fNodeOutlet]`.

### Target-side inputs

- `fConnectorId: InputSignal<string>;`
- `fConnectorCategory: InputSignal<string | undefined>;` _(optional)_
- Legacy: `fInputId` / `fInputCategory` on `[fNodeInput]` _(deprecated)_

### Related outputs (where you persist results)

- `fCreateConnection` from `f-flow[fDraggable]`  
  This is where your app typically adds the new connection to its state/store.

## Styling

During drag-to-connect, the library applies state classes so you can clearly communicate rules:

- `.f-connector-connectable` - marks valid targets during drag
- `.f-connector-not-connectable` - blocked ports (legacy: `.f-node-input-not-connectable` / `.f-node-output-not-connectable`)

(Exact styling is up to you; the library keeps defaults minimal.)

## Notes and pitfalls

- If the allow-list (`fCanBeConnectedTo` / legacy `fCanBeConnectedInputs`) is **empty or undefined**, there is **no allow-list restriction**.
- If you use both ids and categories in one array, make them distinguishable (see conventions above).
- UX restrictions prevent most invalid links, but you should still validate at persistence time (domain rules can evolve).

## Example

::: ng-component <connection-rules></connection-rules> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/connection-rules/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/connection-rules/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connectors/connection-rules/example.scss
:::
