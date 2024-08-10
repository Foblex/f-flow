import {
  Directive, ElementRef, Input,
} from "@angular/core";
import { FComponentsStore } from '../f-storage';
import { IRect, ISize, RectExtensions, SizeExtensions } from '@foblex/core';
import { FFlowMediator } from '../infrastructure';
import { FMinimapData } from './domain';
import { GetNodesRectRequest } from '../domain';

@Directive({
  selector: 'svg[f-minimap-flow]'
})
export class FMinimapFlowDirective {

  public model: FMinimapData;

  @Input()
  public fMinSize: number = 1000;

  public get hostElement(): SVGSVGElement {
    return this.elementReference.nativeElement;
  }

  constructor(
    private elementReference: ElementRef<SVGSVGElement>,
    private fMediator: FFlowMediator,
    private fComponentsStore: FComponentsStore
  ) {
    this.model = new FMinimapData(this.hostElement);
  }

  public update(): void {
    const nodesRect = this.getProcessedNodesRect();
    const minimapRect = this.getMinimapRect();

    const scale = this.calculateViewScale(nodesRect, minimapRect);
    const viewBox = this.calculateViewBox(nodesRect, minimapRect, scale);

    this.model = new FMinimapData(this.hostElement, scale, viewBox);
    this.setViewBox(viewBox);
  }

  private getProcessedNodesRect(): IRect {
    const rawRect = this.fMediator.send<IRect>(new GetNodesRectRequest());
    const normalizedRect = this.normalizeRect(rawRect);
    return this.ensureMinimumSize(normalizedRect);
  }

  private normalizeRect(rect: IRect): IRect {
    return RectExtensions.div(rect, this.fComponentsStore.transform.scale);
  }

  private ensureMinimumSize(rect: IRect): IRect {
    return RectExtensions.initialize(
      rect.x - (Math.max(rect.width, this.fMinSize) - rect.width) / 2,
      rect.y - (Math.max(rect.height, this.fMinSize) - rect.height) / 2,
      Math.max(rect.width, this.fMinSize),
      Math.max(rect.height, this.fMinSize)
    );
  }

  private getMinimapRect(): IRect {
    return RectExtensions.fromElement(this.hostElement);
  }

  private calculateViewScale(nodesRect: IRect, minimapRect: IRect): number {
    return Math.max(nodesRect.width / minimapRect.width, nodesRect.height / minimapRect.height);
  }

  private calculateViewBox(nodesRect: IRect, minimapRect: IRect, scale: number): IRect {
    const viewSize = this.calculateViewSize(minimapRect, scale);
    return this.calculateCenteredViewBox(nodesRect, viewSize, minimapRect, scale);
  }

  private calculateViewSize(minimapRect: IRect, scale: number): ISize {
    return SizeExtensions.initialize(minimapRect.width * scale, minimapRect.height * scale);
  }

  private calculateCenteredViewBox(nodesRect: IRect, viewSize: ISize, minimapRect: IRect, scale: number): IRect {
    const centeredX = nodesRect.x - (viewSize.width - nodesRect.width) / 2 + (minimapRect.width * scale - viewSize.width) / 2;
    const centeredY = nodesRect.y - (viewSize.height - nodesRect.height) / 2 + (minimapRect.height * scale - viewSize.height) / 2;
    return RectExtensions.initialize(centeredX, centeredY, viewSize.width, viewSize.height);
  }

  private setViewBox(viewBox: IRect): void {
    this.hostElement.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
  }
}
