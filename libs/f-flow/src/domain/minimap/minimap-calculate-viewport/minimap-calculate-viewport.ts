import { inject, Injectable } from '@angular/core';
import { MinimapCalculateViewportRequest } from './minimap-calculate-viewport-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { adjustRectToMinSize, IRect, ISize, RectExtensions, SizeExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { FCanvasBase } from '../../../f-canvas';
import { FFlowBase } from '../../../f-flow';
import { IMinimapViewport } from './i-minimap-viewport';
import { CalculateNodesBoundingBoxRequest } from '../../f-node';

@Injectable()
@FExecutionRegister(MinimapCalculateViewportRequest)
export class MinimapCalculateViewport implements IExecution<
  MinimapCalculateViewportRequest,
  IMinimapViewport
> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  public handle({ svg, minSize }: MinimapCalculateViewportRequest): IMinimapViewport {
    const flow = this._store.fFlow;
    const canvas = this._store.fCanvas;

    if (!flow || !canvas) {
      return { scale: 1, viewBox: RectExtensions.initialize(0, 0, 0, 0) };
    }

    const contentRect = this._contentRectInMinimapSpace(flow, canvas, minSize);
    const minimapRect = this._minimapRectInFlowSpace(svg, flow);

    const scale = this._viewportScale(contentRect, minimapRect);
    const viewBox = this._viewportViewBox(contentRect, minimapRect, scale);

    return { scale, viewBox };
  }

  private _contentRectInMinimapSpace(flow: FFlowBase, canvas: FCanvasBase, minSize: number): IRect {
    const global = this._nodesBoundingBox();
    const inFlow = RectExtensions.elementTransform(global, flow.hostElement);
    const inMinimap = RectExtensions.div(inFlow, canvas.transform.scale);

    return adjustRectToMinSize(inMinimap, minSize);
  }

  private _nodesBoundingBox(): IRect {
    return (
      this._mediator.execute<IRect | null>(new CalculateNodesBoundingBoxRequest()) ??
      RectExtensions.initialize(0, 0, 0, 0)
    );
  }

  private _minimapRectInFlowSpace(svg: SVGSVGElement, flow: FFlowBase): IRect {
    return RectExtensions.elementTransform(RectExtensions.fromElement(svg), flow.hostElement);
  }

  private _viewportScale(contentRect: IRect, minimapRect: IRect): number {
    // avoid division by zero
    const mw = minimapRect.width || 1;
    const mh = minimapRect.height || 1;

    return Math.max(contentRect.width / mw, contentRect.height / mh);
  }

  private _viewportViewBox(contentRect: IRect, minimapRect: IRect, scale: number): IRect {
    const viewSize = this._viewportSize(minimapRect, scale);

    const x = contentRect.x - (viewSize.width - contentRect.width) / 2;
    const y = contentRect.y - (viewSize.height - contentRect.height) / 2;

    return RectExtensions.initialize(x, y, viewSize.width, viewSize.height);
  }

  private _viewportSize(minimapRect: IRect, scale: number): ISize {
    return SizeExtensions.initialize(
      minimapRect.width * scale || 0,
      minimapRect.height * scale || 0,
    );
  }
}
