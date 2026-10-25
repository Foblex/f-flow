import { EFFlowFeatureKind, IFFlowFeature } from '../../provide-f-flow';
import { F_INITIAL_VIEW } from './f-initial-view';

/**
 * Activates the initial-view feature inside `provideFFlow(...)`: the flow renders
 * invisibly (`visibility: hidden` — layout and measurements still happen) and is
 * revealed only after the first full render AND the viewport work queued by the
 * `(fFullRendered)` handler have been applied. The first visible frame therefore
 * already carries the viewport the handler set up — no jump from the default
 * position to the fitted one.
 *
 * The hook is the existing `(fFullRendered)` output; call the viewport methods
 * without animation so the reveal shows the final state:
 *
 * ```typescript
 * @Component({
 *   template: `
 *     <f-flow (fFullRendered)="onFullRendered()">
 *       <f-canvas> ... </f-canvas>
 *     </f-flow>
 *   `,
 *   providers: [provideFFlow(withInitialView())],
 * })
 * export class MyFlow {
 *   private readonly _canvas = viewChild.required(FCanvasComponent);
 *
 *   protected onFullRendered(): void {
 *     this._canvas().fitToScreen(PointExtensions.initialize(50, 50), false);
 *   }
 * }
 * ```
 *
 * Without a handler the flow is simply revealed right after the first full render.
 * The reveal happens once; later data changes render as usual.
 *
 * Template-only alternative: set the `fInitialView` input on `<f-flow>` — same
 * behavior without touching the providers array.
 */
export function withInitialView(): IFFlowFeature<EFFlowFeatureKind.INITIAL_VIEW> {
  return {
    kind: EFFlowFeatureKind.INITIAL_VIEW,
    providers: [{ provide: F_INITIAL_VIEW, useValue: true }],
  };
}
