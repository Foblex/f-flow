import { FReflowPlanner } from './planner';
import { FReflowOrchestrator } from './orchestrator';
import { FReflowIgnoreRegistry } from './directives';
import { FReflowBaselineTracker } from './f-reflow-baseline-tracker';

/**
 * Services that must live at the `<f-flow>` injector level because they
 * consume `FComponentsStore` and `FMediator` provided there.
 *
 * Wired unconditionally in `FFlowComponent.providers`. They stay inert
 * until `withReflowOnResize(...)` installs `F_REFLOW_CONFIG` further up
 * the injector tree — the orchestrator and friends reach the controller
 * (also installed by `withReflowOnResize`) through the parent chain.
 *
 * `FReflowController` is intentionally NOT in this list: it is provided
 * by `withReflowOnResize(...)` so consumers can `inject(FReflowController)`
 * directly from the same component that calls `provideFFlow(...)`.
 */
export const F_REFLOW_PROVIDERS = [
  FReflowPlanner,
  FReflowOrchestrator,
  FReflowIgnoreRegistry,
  FReflowBaselineTracker,
];
