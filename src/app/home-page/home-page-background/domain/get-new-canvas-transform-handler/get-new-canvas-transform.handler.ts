import { IHandler } from '@foblex/mediator';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { GetNewCanvasTransformRequest } from './get-new-canvas-transform.request';
import { BrowserService } from '@foblex/platform';

export class GetNewCanvasTransformHandler implements IHandler<GetNewCanvasTransformRequest, ITransformModel> {

  constructor(
    private fBrowser: BrowserService
  ) {
  }
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
    return this.fBrowser.document.querySelector('#home-page-image') as HTMLElement
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
