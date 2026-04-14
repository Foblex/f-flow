import { IPoint } from '@foblex/2d';
import { IPointerEvent } from '../../drag-toolkit';
import { FDragStartedEvent } from '../f-drag-started-event';
import { IDragSessionContext, IDragSessionFeature } from './i-drag-session-feature';

export abstract class DragHandlerBase<TData> {
  protected abstract readonly type: string;
  protected abstract readonly kind: string;

  protected data(): TData | undefined {
    return undefined;
  }

  private readonly _features: IDragSessionFeature[] = [];

  public getEvent(): FDragStartedEvent<TData> {
    return new FDragStartedEvent(this.kind, this.data(), this.type);
  }

  public attachFeature(feature: IDragSessionFeature): void {
    this._features.push(feature);
  }

  protected featuresPrepare(ctx: IDragSessionContext): void {
    for (const feature of this._features) {
      feature.onPrepare?.(ctx);
    }
  }

  protected featuresMove(ctx: IDragSessionContext, delta: IPoint): void {
    for (const feature of this._features) {
      feature.onMove?.(ctx, delta);
    }
  }

  protected featuresFinalize(ctx: IDragSessionContext, delta: IPoint): void {
    for (const feature of this._features) {
      feature.onFinalize?.(ctx, delta);
    }
  }

  protected featuresEnd(ctx: IDragSessionContext): void {
    for (const feature of this._features) {
      feature.onEnd?.(ctx);
    }
  }

  public prepareDragSequence?(): void;
  public abstract onPointerMove(difference: IPoint, event?: IPointerEvent): void;
  public onPointerUp?(): void;

  public destroy?(): void;
}
