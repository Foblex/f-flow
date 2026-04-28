import { IReflowCandidate, IReflowConnection } from '../selection';

/**
 * Narrows the pool further by scope (global / group / connected-subgraph).
 *
 * Applied after the selection strategy so that scope is always an intersection,
 * never a union.
 */
export interface IFReflowScopeFilter {
  filter(input: {
    sourceCandidate: IReflowCandidate | null;
    candidates: IReflowCandidate[];
    connections: IReflowConnection[];
  }): IReflowCandidate[];
}
