import { IFReflowSelectionStrategy, IReflowCandidate } from './i-f-reflow-selection-strategy';

/**
 * Default strategy: every candidate except the source and ignored nodes is
 * eligible. The actual "who is actually below / above" decision is made by
 * the delta calculator based on geometric comparison of rects.
 */
export class CenterOfMassSelectionStrategy implements IFReflowSelectionStrategy {
  public select({
    sourceId,
    candidates,
  }: {
    sourceId: string;
    candidates: IReflowCandidate[];
  }): IReflowCandidate[] {
    // Ignored candidates stay in the stream — the planner skips them
    // when computing shifts but keeps them in the collision pool.
    return candidates.filter((candidate) => candidate.id !== sourceId);
  }
}
