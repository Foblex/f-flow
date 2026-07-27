---
publishedAt: "2026-07-27"
updatedAt: "2026-07-27"
---

# Shadow DOM and Angular Elements

Foblex Flow v19.1 supports editors rendered inside open shadow roots, including a component that uses `ViewEncapsulation.ShadowDom` and is exported as an Angular Element. Pointer gestures, connection target resolution, background detection, palette drops, and coordinate hit-testing follow elements inside the shadow tree.

No Foblex provider or compatibility flag is required:

```ts
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'app-embedded-flow',
  imports: [FFlowModule],
  templateUrl: './embedded-flow.html',
  styleUrl: './embedded-flow.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class EmbeddedFlow {}
```

Normal DOM integrations continue to use `event.target`. When the browser retargets a document-level event at a shadow host, Foblex Flow falls back to the event's composed path. Coordinate hit-testing follows `elementsFromPoint()` through nested open shadow roots while preserving native hit order.

## Style inside the boundary

Document-level CSS does not cross a shadow boundary. If your application normally registers the default Foblex theme in `angular.json`, import the required theme layers or define your editor styles inside the shadow component stylesheet as well.

For example:

```scss
@use '@foblex/flow/styles/default';

:host {
  display: block;
  width: 100%;
  height: 100%;
}
```

Keep the flow host and all ancestor sizing explicit. A shadow root does not change the requirement that `<f-flow>` must have a non-zero height; development diagnostic `FF1002` reports a collapsed host.

## Angular Elements

The same open-root behavior applies when the component is registered as a custom element:

```ts
const element = createCustomElement(EmbeddedFlow, { injector });
customElements.define('embedded-flow', element);
```

Keep application data and element inputs serializable at the custom-element boundary. Foblex Flow's interaction runtime stays inside the Angular component; persistence and cross-application communication remain your integration contract.

## Limitations and checks

- Closed shadow roots are unsupported because the browser does not expose their internal tree for deep hit-testing.
- Global application themes do not style content inside the shadow root automatically.
- Native controls inside nodes keep their normal interaction behavior and should not be covered by custom host-level pointer interception.
- Test drag, create/reassign connection, click-to-connect, keyboard interaction, external palette drop, and browser zoom in the actual embedding host.
- If an outer application adds its own shadow roots, keep every root that Foblex Flow must traverse open.

See the [v19.1 release article](./blog/foblex-flow-v19-1-0-managed-state-faster-large-flows-and-shadow-dom-support) for the implementation background.
