import { IPoint, IRect, ITransformModel } from '@foblex/2d';

export interface IDragSessionFeature {
  onPrepare?(ctx: IDragSessionContext): void;
  onMove?(ctx: IDragSessionContext, delta: IPoint): void;
  onFinalize?(ctx: IDragSessionContext, delta: IPoint): void;
  onEnd?(ctx: IDragSessionContext): void;
}

export interface IDragSessionContext {
  flowHost: HTMLElement;
  transform: ITransformModel;

  getDraggedUnionRect(delta: IPoint): IRect;
}
