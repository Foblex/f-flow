# Connection Rules

Connection rules let you **restrict which inputs can accept a connection** from a specific **output** or **outlet**.

Instead of letting users connect anything to anything, you can declare an allow‑list directly on the _source connector_ and the library will:

- highlight only valid targets during drag,
- block invalid targets from being connected,
- reduce “invalid graph” states caused by user mistakes.

> Connection rules are a **UX guardrail**. Your app should still validate and persist the final graph state.

## How it works

Rules are defined on **source connectors**:

- [`fNodeOutput`](f-node-output-directive)
- [`fNodeOutlet`](f-node-outlet-directive)

You provide:

- `fCanBeConnectedInputs: string[]`

During drag-to-connect, the library checks each candidate target [`fNodeInput`](f-node-input-directive) and considers it connectable when **either** matches:

- the target `fInputId`
- the target `fInputCategory` (if you use categories)

## Quick start

### Allow only one specific input (by id)

```html
<div
  fNodeOutput
  fOutputId="out-1"
  [fCanBeConnectedInputs]="['input-approve']"
>
  Output
</div>

<div fNodeInput fInputId="input-approve">Approve</div>
<div fNodeInput fInputId="input-reject">Reject</div>
```

Only `input-approve` can be targeted.

### Allow a whole class of inputs (by category)

```html
<div
  fNodeOutput
  fOutputId="out-1"
  [fCanBeConnectedInputs]="['A']"
>
  Output
</div>

<div fNodeInput fInputId="input-1" fInputCategory="A">Category A</div>
<div fNodeInput fInputId="input-2" fInputCategory="B">Category B</div>
```

Only inputs with `fInputCategory="A"` are valid targets.

## Naming conventions for `fCanBeConnectedInputs`

`fCanBeConnectedInputs` is a simple allow-list of **strings**.  
Each string can be interpreted as either:

- a concrete **input id** (`fInputId`)
- or an **input category** (`fInputCategory`)

Because both are plain strings, you should adopt a convention to avoid accidental collisions
(when some `fInputId` equals a category name).

### Recommended convention

Use **prefixes**:

- `id:<inputId>` — for a specific input
- `cat:<category>` — for a category

Example:

```html
<div
  fNodeOutput
  fOutputId="out-1"
  [fCanBeConnectedInputs]="['id:input1', 'cat:A']"
>
  Output
</div>
```

And on the targets:

```html
<div fNodeInput fInputId="input1" fInputCategory="B">Input input1</div>
<div fNodeInput fInputId="input2" fInputCategory="A">Input A</div>
```

### If you don't want prefixes

You can also enforce “no overlap” by policy:

- input ids are always like `input:<name>` or `in-<number>`
- categories are always like `CAT_<name>` or `type:<name>`

The key point is: **make ids and categories visually distinct** so allow-lists are readable and safe.

## API

### Source-side input

- `fCanBeConnectedInputs: string[];`  
  Declared on `[fNodeOutput]` and `[fNodeOutlet]`.

### Target-side inputs

- `fInputId: InputSignal<string>;`
- `fInputCategory: InputSignal<string | undefined>;` _(optional)_

### Related outputs (where you persist results)

- `fCreateConnection` from `f-flow[fDraggable]`  
  This is where your app typically adds the new connection to its state/store.

## Styling

During drag-to-connect, the library applies state classes so you can clearly communicate rules:

- `.f-connector-connectable` - marks valid targets during drag
- `.f-node-input-not-connectable` / `.f-node-output-not-connectable` - blocked ports

(Exact styling is up to you; the library keeps defaults minimal.)

## Notes and pitfalls

- If `fCanBeConnectedInputs` is **empty or undefined**, there is **no allow-list restriction**.
- If you use both ids and categories in one array, make them distinguishable (see conventions above).
- UX restrictions prevent most invalid links, but you should still validate at persistence time (domain rules can evolve).

## Example

::: ng-component <connection-rules></connection-rules> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connection-rules/connection-rules.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connection-rules/connection-rules.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connection-rules/connection-rules.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
