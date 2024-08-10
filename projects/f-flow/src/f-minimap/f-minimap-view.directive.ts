import { Directive, ElementRef } from "@angular/core";
import { FComponentsStore } from '../f-storage';
import { FFlowMediator } from '../infrastructure';
import { IPoint, IRect, ISize, PointExtensions, RectExtensions, SizeExtensions } from '@foblex/core';
import { FMinimapFlowDirective } from './f-minimap-flow.directive';

@Directive({
  selector: 'rect[f-minimap-view]',
  host: {
    'class': 'f-component f-minimap-view',
  }
})
export class FMinimapViewDirective {

  public get hostElement(): SVGRectElement {
    return this.elementReference.nativeElement;
  }

  private get flowScale(): number {
    return this.fComponentsStore!.transform!.scale!;
  }

  constructor(
    private elementReference: ElementRef<SVGRectElement>,
    private fMinimapFlow: FMinimapFlowDirective,
    private fMediator: FFlowMediator,
    private fComponentsStore: FComponentsStore
  ) {
  }

  public update(): void {
    const targetRect = RectExtensions.fromElement(this.fComponentsStore.flowHost);
    const minimapRect = RectExtensions.fromElement(this.fMinimapFlow.hostElement);

    const viewScale = this.calculateViewScale(targetRect, minimapRect);
    const viewBox = this.calculateViewBox(targetRect, minimapRect, viewScale);

    this.setAttributes(viewBox);
  }

  private calculateViewScale(targetRect: IRect, minimapRect: IRect): number {
    return Math.max(targetRect.width / minimapRect.width, targetRect.height / minimapRect.height);
  }

  private calculateViewBox(targetRect: IRect, minimapRect: IRect, viewScale: number): IRect {
    const viewSize = this.calculateViewSize(minimapRect, viewScale);
    const position = this.calculateViewBoxPosition(targetRect, viewSize, minimapRect, viewScale);
    const viewBox = RectExtensions.initialize(position.x, position.y, viewSize.width, viewSize.height);
    return RectExtensions.div(viewBox, this.flowScale);
  }

  private calculateViewSize(minimapRect: IRect, viewScale: number): ISize {
    return SizeExtensions.initialize(minimapRect.width * viewScale, minimapRect.height * viewScale);
  }

  private calculateViewBoxPosition(targetRect: IRect, viewSize: ISize, minimapRect: IRect, viewScale: number): IPoint {
    return PointExtensions.initialize(
      targetRect.x - (viewSize.width - targetRect.width) / 2 + (minimapRect.width * viewScale - viewSize.width) / 2,
      targetRect.y - (viewSize.height - targetRect.height) / 2 + (minimapRect.height * viewScale - viewSize.height) / 2
    );
  }

  private setAttributes(viewBox: IRect): void {
    this.hostElement.setAttribute('x', viewBox.x.toString());
    this.hostElement.setAttribute('y', viewBox.y.toString());
    this.hostElement.setAttribute('width', viewBox.width.toString());
    this.hostElement.setAttribute('height', viewBox.height.toString());
  }
}
