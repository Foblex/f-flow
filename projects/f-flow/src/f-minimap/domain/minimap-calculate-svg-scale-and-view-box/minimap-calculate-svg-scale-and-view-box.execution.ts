import { inject, Injectable } from '@angular/core';
import { MinimapCalculateSvgScaleAndViewBoxRequest } from './minimap-calculate-svg-scale-and-view-box.request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { adjustRectToMinSize, IRect, ISize, RectExtensions, SizeExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { FCanvasBase } from '../../../f-canvas';
import { FFlowBase } from '../../../f-flow';
import { CalculateNodesBoundingBoxRequest } from '../../../domain';
import { IFMinimapScaleAndViewBox } from './i-f-minimap-scale-and-view-box';

@Injectable()
@FExecutionRegister(MinimapCalculateSvgScaleAndViewBoxRequest)
export class MinimapCalculateSvgScaleAndViewBoxExecution
  implements IExecution<MinimapCalculateSvgScaleAndViewBoxRequest, IFMinimapScaleAndViewBox> {

  private _fMediator = inject(FMediator);

  private _fComponentStore = inject(FComponentsStore);

  private get _fFlow(): FFlowBase {
    return this._fComponentStore.fFlow!;
  }

  private get _fCanvas(): FCanvasBase {
    return this._fComponentStore.fCanvas!;
  }

  public handle(request: MinimapCalculateSvgScaleAndViewBoxRequest): IFMinimapScaleAndViewBox {
    if(!this._fFlow) {
      return { scale: 1, viewBox: RectExtensions.initialize(0, 0, 0, 0) };
    }

    const nodesRect = this._getScaledNodesBoundingBox(request.minSize);
    const minimapRect = this._getMinimapRect(request.element);
    const scale = this._calculateViewScale(nodesRect, minimapRect);

    return {
      scale,
      viewBox: this._calculateViewBox(nodesRect, minimapRect, scale),
    }
  }

  private _getScaledNodesBoundingBox(minSize: number): IRect {
    const globalRect = this._calculateNodesBoundingBox();
    const flowRect = this._convertFromGlobalToFlowRect(globalRect);
    const scaledRect = this._convertRectToMinimapScale(flowRect);

    return adjustRectToMinSize(scaledRect, minSize);
  }

  private _calculateNodesBoundingBox(): IRect {
    return this._fMediator.execute<IRect | null>(new CalculateNodesBoundingBoxRequest())
      || RectExtensions.initialize(0, 0, 0, 0);
  }

  private _convertFromGlobalToFlowRect(rect: IRect): IRect {
    return RectExtensions.elementTransform(rect, this._fFlow!.hostElement)
  }

  private _convertRectToMinimapScale(rect: IRect): IRect {
    return RectExtensions.div(rect, this._fCanvas.transform.scale);
  }

  private _getMinimapRect(element: SVGSVGElement): IRect {
    return RectExtensions.elementTransform(RectExtensions.fromElement(element), this._fFlow.hostElement);
  }

  private _calculateViewScale(nodesRect: IRect, minimapRect: IRect): number {
    return Math.max(nodesRect.width / minimapRect.width, nodesRect.height / minimapRect.height);
  }

  private _calculateViewBox(nodesRect: IRect, minimapRect: IRect, scale: number): IRect {
    return this._calculateCenteredViewBox(nodesRect, this._calculateViewSize(minimapRect, scale));
  }

  private _calculateViewSize(minimapRect: IRect, scale: number): ISize {
    return SizeExtensions.initialize(minimapRect.width * scale || 0, minimapRect.height * scale || 0);
  }

  private _calculateCenteredViewBox(nodesRect: IRect, viewSize: ISize): IRect {
    const centeredX = nodesRect.x - (viewSize.width - nodesRect.width) / 2;
    const centeredY = nodesRect.y - (viewSize.height - nodesRect.height) / 2;

    return RectExtensions.initialize(centeredX, centeredY, viewSize.width, viewSize.height);
  }
}
