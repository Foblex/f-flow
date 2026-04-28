import { IReflowCandidate } from '../selection';
import { IFReflowScopeFilter } from './i-f-reflow-scope-filter';

/**
 * Restricts the candidate pool to siblings of the resizing source —
 * candidates whose `fParentId` matches the source's. With no source
 * candidate or a top-level source (`parentId == null`), only top-level
 * candidates pass.
 *
 * Use case: a node inside a group expands; we want neighbors *inside the
 * same group* to shift, but not nodes living outside the group's
 * boundary or under a different parent.
 */
export class GroupScopeFilter implements IFReflowScopeFilter {
  public filter({
    sourceCandidate,
    candidates,
  }: {
    sourceCandidate: IReflowCandidate | null;
    candidates: IReflowCandidate[];
  }): IReflowCandidate[] {
    const sourceParentId = sourceCandidate?.parentId ?? null;

    return candidates.filter((c) => (c.parentId ?? null) === sourceParentId);
  }
}
