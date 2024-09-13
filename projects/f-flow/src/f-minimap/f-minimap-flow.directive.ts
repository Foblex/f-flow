import {
  Directive, ElementRef, Input,
} from "@angular/core";
import { FComponentsStore } from '../f-storage';
import { IRect, ISize, RectExtensions, SizeExtensions } from '@foblex/core';
import { FFlowMediator } from '../infrastructure';
import { checkRectIsFinite, FMinimapData } from './domain';
import { GetNodesRectRequest } from '../domain';

@Directive({
  selector: 'svg[fMinimapFlow]'
})
export class FMinimapFlowDirective {

  public model: FMinimapData;

  @Input()
  public fMinSize: number = 1000;

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.flowHost;
  }

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
    const normalizedRect = this.normalizeRect(this.getNodesRect());
    return this.ensureMinimumSize(normalizedRect);
  }

  private getNodesRect(): IRect {
    const rect = this.fMediator.send<IRect | null>(new GetNodesRectRequest()) || RectExtensions.initialize(0, 0, 0, 0);
    return RectExtensions.elementTransform(rect, this.flowHost)
  }

  private getMinimapRect(): IRect {
    return RectExtensions.elementTransform(RectExtensions.fromElement(this.hostElement), this.flowHost);
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

  private calculateViewScale(nodesRect: IRect, minimapRect: IRect): number {
    return Math.max(nodesRect.width / minimapRect.width, nodesRect.height / minimapRect.height);
  }

  private calculateViewBox(nodesRect: IRect, minimapRect: IRect, scale: number): IRect {
    return this.calculateCenteredViewBox(nodesRect, this.calculateViewSize(minimapRect, scale));
  }

  private calculateViewSize(minimapRect: IRect, scale: number): ISize {
    return SizeExtensions.initialize(minimapRect.width * scale || 0, minimapRect.height * scale || 0);
  }

  private calculateCenteredViewBox(nodesRect: IRect, viewSize: ISize): IRect {
    const centeredX = nodesRect.x - (viewSize.width - nodesRect.width) / 2;
    const centeredY = nodesRect.y - (viewSize.height - nodesRect.height) / 2;
    return RectExtensions.initialize(centeredX, centeredY, viewSize.width, viewSize.height);
  }

  private setViewBox(viewBox: IRect): void {
    viewBox = checkRectIsFinite(viewBox);
    this.hostElement.setAttribute('viewBox', `${ viewBox.x } ${ viewBox.y } ${ viewBox.width } ${ viewBox.height }`);
  }
}
