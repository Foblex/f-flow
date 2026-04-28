import { IRect } from '@foblex/2d';
import { EFReflowAxis } from '../enums';

/**
 * A node entry visible to the reflow planner. Produced by the orchestrator
 * from `FComponentsStore` + `GetNormalizedElementRectRequest`.
 */
export interface IReflowCandidate {
  id: string;
  rect: IRect;
  parentId: string | null | undefined;
  isIgnored: boolean;
}

/**
 * Node-to-node link materialised from `FComponentsStore.connections` by
 * the orchestrator. Connector ids are resolved up to owning node ids so
 * graph-based selection strategies don't need to walk the connector
 * registry themselves.
 */
export interface IReflowConnection {
  outputNodeId: string;
  inputNodeId: string;
}

/**
 * Pre-filter that narrows the candidate pool by mode (geometric / graph-based).
 * Does not apply deltas or scope constraints.
 */
export interface IFReflowSelectionStrategy {
  select(input: {
    sourceId: string;
    sourceBaselineRect: IRect;
    sourceNextRect: IRect;
    candidates: IReflowCandidate[];
    connections: IReflowConnection[];
    axis: EFReflowAxis;
  }): IReflowCandidate[];
}
