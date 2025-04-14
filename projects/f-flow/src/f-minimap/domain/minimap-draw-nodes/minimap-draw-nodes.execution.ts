import { inject, Injectable } from '@angular/core';
import { MinimapDrawNodesRequest } from './minimap-draw-nodes.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { createSVGElement } from '../../../domain';
import { FNodeBase, FNodeDirective } from '../../../f-node';
import { IRect, RectExtensions, setRectToElement } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { BrowserService } from '@foblex/platform';
import { FCanvasBase } from '../../../f-canvas';
import { FFlowBase } from '../../../f-flow';
import { isArray } from 'node:util';

@Injectable()
@FExecutionRegister(MinimapDrawNodesRequest)
export class MinimapDrawNodesExecution implements IExecution<MinimapDrawNodesRequest, SVGRectElement[]> {

  private readonly _fBrowser = inject(BrowserService);
  private readonly _fComponentStore = inject(FComponentsStore);

  private get _fFlow(): FFlowBase | undefined {
    return this._fComponentStore.fFlow;
  }

  private get _fNodes(): FNodeBase[] {
    return this._fComponentStore.fNodes;
  }

  private get _fCanvas(): FCanvasBase {
    return this._fComponentStore.fCanvas!;
  }

  public handle(request: MinimapDrawNodesRequest): SVGRectElement[] {
    return this._createMinimapNodeElements(request);
  }

  private _createMinimapNodeElements(request: MinimapDrawNodesRequest): SVGRectElement[] {
    return this._fNodes.map((x) => {
      const element = this._createNodeElement();
      setRectToElement(this._getNodeRect(x), element);
      this._applyClassList(element, x, x instanceof FNodeDirective);
      return element;
    });
  }

  private _createNodeElement(): SVGRectElement {
    return createSVGElement('rect', this._fBrowser);
  }

  private _getNodeRect(node: FNodeBase): IRect {
    return RectExtensions.div(this._getNodeRectInFlow(node), this._fCanvas.transform.scale);
  }

  private _getNodeRectInFlow(node: FNodeBase): IRect {
    return RectExtensions.elementTransform(RectExtensions.fromElement(node.hostElement), this._fFlow!.hostElement);
  }

  private _applyClassList(element: SVGRectElement, node: FNodeBase, isNode: boolean): void {
    element.classList.add('f-component', isNode ? 'f-minimap-node' : 'f-minimap-group');
    element.classList.add(...this._getClassList(node));
    if (node.isSelected()) {
      element.classList.add('f-selected');
    }
  }

  private _getClassList(node: FNodeBase): string[] {
    if (Array.isArray(node.fMinimapClass)) {
      return node.fMinimapClass;
    } else {
      return [node.fMinimapClass];
    }
  }
}
