import {
  IHasHostElement,
  ITransformModel, PointExtensions,
  TransformModelExtensions,
  ICanChangePosition, ICanChangeZoom, ICanFitToParent, ICanOneToOneCentering,
  mixinChangePosition,
  mixinChangeZoom,
  mixinFitToParent,
  mixinOneToOneCentering, IPoint
} from '@foblex/core';
import { Directive, ElementRef, EventEmitter, InjectionToken } from '@angular/core';
import { FCanvasChangeEvent } from './domain';
import { FNodeBase } from '../f-node';

export const F_CANVAS = new InjectionToken<FCanvasBase>('F_CANVAS');

const MIXIN_BASE = mixinChangePosition(
    mixinFitToParent(
        mixinOneToOneCentering(
            mixinChangeZoom(
                class {
                  constructor(
                      public transform: ITransformModel
                  ) {
                  }
                }))));

@Directive()
export abstract class FCanvasBase
    extends MIXIN_BASE
    implements IHasHostElement, ICanChangePosition, ICanFitToParent, ICanOneToOneCentering, ICanChangeZoom {

  public abstract fCanvasChange: EventEmitter<FCanvasChangeEvent>;

  public abstract fNodes: FNodeBase[];

  public abstract hostElement: HTMLElement;

  public abstract fNodesContainer: ElementRef<HTMLElement>;

  public abstract fConnectionsContainer: ElementRef<HTMLElement>;

  protected constructor() {
    super(TransformModelExtensions.default());
  }

  public abstract redraw(): void;

  public abstract redrawWithAnimation(): void;

  public completeDrag(): void {
    this.fCanvasChange.emit(
        new FCanvasChangeEvent(this.getCanvasPosition(), this.transform.scale)
    );
  }

  private getCanvasPosition(): IPoint {
    return PointExtensions.sum(this.transform.position, this.transform.scaledPosition);
  }
}
