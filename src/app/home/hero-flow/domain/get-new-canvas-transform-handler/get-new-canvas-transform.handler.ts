import { IHandler, IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/core';
import { GetNewCanvasTransformRequest } from './get-new-canvas-transform.request';

export class GetNewCanvasTransformHandler implements IHandler<GetNewCanvasTransformRequest, ITransformModel> {

  public handle(request: GetNewCanvasTransformRequest): ITransformModel {
    const heroImageRect = this.getHeroImageRect();
    const scale = heroImageRect.height / 320;

    const newCanvasPosition = this.getNewCanvasPosition(request.nodesRect, heroImageRect, scale);
    return {
      position: newCanvasPosition,
      scaledPosition: PointExtensions.initialize(),
      scale: scale,
      rotate: 0,
    };
  }

  private getHeroImageElement(): HTMLElement {
    return document.querySelector('#hero-image') as HTMLElement
  }

  private getHeroImageRect(): IRect {
    return RectExtensions.fromElement(this.getHeroImageElement());
  }

  private getNewCanvasPosition(nodesRect: IRect, heroImageRect: IRect, scale: number): IPoint {
    return PointExtensions.initialize(
      heroImageRect.gravityCenter.x - nodesRect.gravityCenter.x * scale,
      heroImageRect.gravityCenter.y  - nodesRect.gravityCenter.y * scale
    );
  }
}
