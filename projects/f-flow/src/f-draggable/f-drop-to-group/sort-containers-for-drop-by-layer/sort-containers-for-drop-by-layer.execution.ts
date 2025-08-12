import {Injectable} from '@angular/core';
import {FExecutionRegister, IExecution} from '@foblex/mediator';
import {SortContainersForDropByLayerRequest} from "./sort-containers-for-drop-by-layer.request";
import {INodeWithRect} from "../../domain";

@Injectable()
@FExecutionRegister(SortContainersForDropByLayerRequest)
export class SortContainersForDropByLayerExecution implements IExecution<SortContainersForDropByLayerRequest, INodeWithRect[]> {

  public handle({containersForDrop}: SortContainersForDropByLayerRequest): INodeWithRect[] {
    return containersForDrop.sort((containerA, containerB) => {
      return this._compareByDomLayer(containerA.node.hostElement, containerB.node.hostElement);
    });
  }

  private _compareByDomLayer(a: Element, b: Element): number {
    if (a === b) return 0;
    const pos = a.compareDocumentPosition(b);

    // a раньше b в DOM → хотим, чтобы a шёл ПОЗЖЕ в массиве → возвращаем 1
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return 1;
    // a позже b в DOM → a должен быть РАНЬШЕ в массиве → возвращаем -1
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return -1;

    // Если узлы "разобщены" (например, из разных shadow-root или временно не в документе)
    if (pos & Node.DOCUMENT_POSITION_DISCONNECTED) {
      // запасной вариант: стабилизируем по top/left, а при равенстве — по исходному порядку
      const ar = (a as HTMLElement).getBoundingClientRect?.() ?? {top: 0, left: 0};
      const br = (b as HTMLElement).getBoundingClientRect?.() ?? {top: 0, left: 0};
      if (ar.top !== br.top) return ar.top - br.top;
      if (ar.left !== br.left) return ar.left - br.left;
      return 0;
    }

    return 0;
  }
}
