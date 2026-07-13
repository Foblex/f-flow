import { EFFlowFeatureKind, IFFlowFeature } from '../../provide-f-flow';
import { FFlowState } from './f-flow-state';
import { F_FLOW_STATE_CONFIG, IFFlowStateConfig, mergeFlowStateConfig } from './i-f-flow-state';

/**
 * Turns on the managed graph state inside `provideFFlow(...)`.
 *
 * ```typescript
 * @Component({
 *   providers: [provideFFlow(withFlowState())],
 * })
 * export class MyFlow {
 *   protected readonly state = injectFlowState<MyNodeData>();
 *
 *   constructor() {
 *     this.state.load({ nodes: [...], connections: [...] });
 *   }
 * }
 * ```
 *
 * The template renders `state.nodes()` / `state.connections()` with `@for`,
 * and that is the whole integration: finished gestures (create/reassign
 * connection, node moves, drops into groups, external-item drops, delete
 * requests) are applied to the state automatically, each as one undoable
 * step. `undo()`/`redo()` with `canUndo`/`canRedo` signals come built in;
 * `snapshot()` returns the graph as plain arrays for persistence.
 *
 * Every store behavior is overridable: subclass `FFlowState` (any CRUD
 * method, any `apply*` gesture handler, any protected building block) and
 * install it via `withFlowState({ stateClass: MyFlowState })`.
 *
 * The classic event-driven API keeps working unchanged — this plugin is for
 * apps that would rather hand the data bookkeeping to the library.
 */
export function withFlowState(config?: IFFlowStateConfig): IFFlowFeature<EFFlowFeatureKind.STATE> {
  const resolved = mergeFlowStateConfig(config);

  return {
    kind: EFFlowFeatureKind.STATE,
    providers: [
      { provide: FFlowState, useClass: resolved.stateClass ?? FFlowState },
      { provide: F_FLOW_STATE_CONFIG, useValue: resolved },
    ],
  };
}
