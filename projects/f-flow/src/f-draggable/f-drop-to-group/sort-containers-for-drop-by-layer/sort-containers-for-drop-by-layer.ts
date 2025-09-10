import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { SortContainersForDropByLayerRequest } from "./sort-containers-for-drop-by-layer-request";
import { INodeWithRect } from "../../domain";

@Injectable()
@FExecutionRegister(SortContainersForDropByLayerRequest)
export class SortContainersForDropByLayer implements IExecution<SortContainersForDropByLayerRequest, INodeWithRect[]> {

  public handle({ containersForDrop }: SortContainersForDropByLayerRequest): INodeWithRect[] {
    const decorated = containersForDrop.map((item, idx) => ({ item, idx }));

    decorated.sort((a, b) => {
      const elA = a.item.node.hostElement;
      const elB = b.item.node.hostElement;

      const domOrder = this._domOrder(elA, elB);

      if (domOrder !== 0) {
return -domOrder;
}

      return a.idx - b.idx;
    });

    return decorated.map(d => d.item);
  }

  private _domOrder(a: Element, b: Element): number {
    if (a === b) {
return 0;
}

    const pos = a.compareDocumentPosition(b);

    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) {
return -1;
}
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) {
return 1;
}

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
