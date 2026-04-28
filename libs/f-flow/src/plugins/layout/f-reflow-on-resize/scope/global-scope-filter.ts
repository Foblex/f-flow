import { IReflowCandidate } from '../selection';
import { IFReflowScopeFilter } from './i-f-reflow-scope-filter';

export class GlobalScopeFilter implements IFReflowScopeFilter {
  public filter({ candidates }: { candidates: IReflowCandidate[] }): IReflowCandidate[] {
    return candidates;
  }
}
