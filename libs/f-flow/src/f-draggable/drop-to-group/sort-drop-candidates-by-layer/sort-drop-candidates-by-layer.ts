import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { SortDropCandidatesByLayerRequest } from './sort-drop-candidates-by-layer-request';
import { INodeWithRect } from '../../domain';

@Injectable()
@FExecutionRegister(SortDropCandidatesByLayerRequest)
export class SortDropCandidatesByLayer
  implements IExecution<SortDropCandidatesByLayerRequest, INodeWithRect[]>
{
  public handle({ candidates }: SortDropCandidatesByLayerRequest): INodeWithRect[] {
    // Stable sort even if runtime sort stability changes: remember original index.
    const indexed = candidates.map((candidate, index) => ({ candidate, index }));

    indexed.sort((a, b) => {
      const domOrder = this._compareDomOrder(
        a.candidate.node.hostElement,
        b.candidate.node.hostElement,
      );

      // We want "top-most" candidates first (the ones later in DOM usually paint above).
      if (domOrder !== 0) {
        return -domOrder;
      }

      return a.index - b.index;
    });

    return indexed.map((x) => x.candidate);
  }

  private _compareDomOrder(a: Element, b: Element): number {
    if (a === b) {
      return 0;
    }

    const pos = a.compareDocumentPosition(b);

    // If b is after a in DOM => a precedes b.
    if ((pos & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
      return -1;
    }

    // If b is before a in DOM => a follows b.
    if ((pos & Node.DOCUMENT_POSITION_PRECEDING) !== 0) {
      return 1;
    }

    // Disconnected: fallback (rare). Use geometry to get deterministic order.
    if (pos & Node.DOCUMENT_POSITION_DISCONNECTED) {
      const ar = (a as HTMLElement).getBoundingClientRect?.() ?? { top: 0, left: 0 };
      const br = (b as HTMLElement).getBoundingClientRect?.() ?? { top: 0, left: 0 };

      if (ar.top !== br.top) {
        return ar.top < br.top ? -1 : 1;
      }
      if (ar.left !== br.left) {
        return ar.left < br.left ? -1 : 1;
      }

      return 0;
    }

    return 0;
  }
}
