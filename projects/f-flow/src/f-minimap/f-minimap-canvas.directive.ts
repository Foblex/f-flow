import {
  Directive, ElementRef,
} from "@angular/core";
import { FComponentsStore } from '../f-storage';
import {
  DomElementExtensions, IRect,
  RectExtensions
} from '@foblex/core';
import { FNodeBase, FNodeDirective } from '../f-node';

@Directive({
  selector: 'g[fMinimapCanvas]'
})
export class FMinimapCanvasDirective {

  public get hostElement(): SVGGElement {
    return this.elementReference.nativeElement;
  }

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.flowHost;
  }

  private get flowScale(): number {
    return this.fComponentsStore.transform.scale;
  }

  constructor(
    private elementReference: ElementRef<SVGGElement>,
    private fComponentsStore: FComponentsStore
  ) {
  }

  public redraw(): void {
    this.clearCanvas();
    this.fComponentsStore.fNodes.forEach((x) => this.renderNode(x));
  }

  private clearCanvas(): void {
    this.hostElement.innerHTML = '';
  }

  private renderNode(node: FNodeBase): void {
    const element = DomElementExtensions.createSvgElement('rect');
    this.configureNodeElement(element, node);
    this.hostElement.appendChild(element);
  }

  private configureNodeElement(element: SVGRectElement, node: FNodeBase): void {
    this.setElementAttributes(element, this.getNodeRect(node));
    this.applyClassList(element, node, node instanceof FNodeDirective);
  }

  private getNodeRect(node: FNodeBase): IRect {
    const nodeRectInFlow = RectExtensions.elementTransform(RectExtensions.fromElement(node.hostElement), this.flowHost);
    return RectExtensions.div(nodeRectInFlow, this.flowScale);
  }

  private setElementAttributes(element: SVGRectElement, rect: IRect): void {
    element.setAttribute('x', rect.x.toString());
    element.setAttribute('y', rect.y.toString());
    element.setAttribute('width', rect.width.toString());
    element.setAttribute('height', rect.height.toString());
  }

  private applyClassList(element: SVGRectElement, node: FNodeBase, isNode: boolean): void {
    element.classList.add('f-component', isNode ? 'f-minimap-node' : 'f-minimap-group');
    if (node.isSelected()) {
      element.classList.add('f-selected');
    }
  }
}
