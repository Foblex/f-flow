import { inject, Injectable } from '@angular/core';
import { MinimapDrawNodesRequest } from './minimap-draw-nodes-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { createSVGElement } from '../../../domain';
import { FNodeBase, FNodeDirective } from '../../../f-node';
import { IRect, RectExtensions, setRectToElement } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { BrowserService } from '@foblex/platform';
import { FCanvasBase } from '../../../f-canvas';
import { FFlowBase } from '../../../f-flow';

@Injectable()
@FExecutionRegister(MinimapDrawNodesRequest)
export class MinimapDrawNodes implements IExecution<MinimapDrawNodesRequest, SVGRectElement[]> {
  private readonly _browser = inject(BrowserService);
  private readonly _store = inject(FComponentsStore);

  public handle(_: MinimapDrawNodesRequest): SVGRectElement[] {
    const flow = this._store.fFlow;
    const canvas = this._store.fCanvas;

    if (!flow || !canvas) {
      return [];
    }

    const nodes = this._store.nodes.getAll();

    return nodes.map((node) => this._renderNode(node, flow, canvas));
  }

  private _renderNode(node: FNodeBase, flow: FFlowBase, canvas: FCanvasBase): SVGRectElement {
    const rect = createSVGElement('rect', this._browser);
    setRectToElement(this._nodeRect(node, flow, canvas), rect);

    const isNode = node instanceof FNodeDirective;

    rect.classList.add('f-component', isNode ? 'f-minimap-node' : 'f-minimap-group');
    rect.classList.add(...this._minimapClasses(node));

    if (node.isSelected()) {
      rect.classList.add('f-selected');
    }

    return rect;
  }

  private _nodeRect(node: FNodeBase, flow: FFlowBase, canvas: FCanvasBase): IRect {
    const inFlow = RectExtensions.elementTransform(
      RectExtensions.fromElement(node.hostElement),
      flow.hostElement,
    );

    return RectExtensions.div(inFlow, canvas.transform.scale);
  }

  private _minimapClasses(node: FNodeBase): string[] {
    const classes = node.fMinimapClass();

    return Array.isArray(classes) ? classes : [classes];
  }
}
