import { PointExtensions, TransformModelExtensions, IPoint } from '@foblex/2d';
import { Directive, ElementRef, EventEmitter, InjectionToken } from '@angular/core';
import { FCanvasChangeEvent } from './domain';
import { IHasHostElement } from '../i-has-host-element';

export const F_CANVAS = new InjectionToken<FCanvasBase>('F_CANVAS');

@Directive()
export abstract class FCanvasBase implements IHasHostElement {

  public abstract fCanvasChange: EventEmitter<FCanvasChangeEvent>;

  public abstract hostElement: HTMLElement;

  public abstract fGroupsContainer: ElementRef<HTMLElement>;

  public abstract fNodesContainer: ElementRef<HTMLElement>;

  public abstract fConnectionsContainer: ElementRef<HTMLElement>;

  public transform = TransformModelExtensions.default();

  public abstract redraw(): void;

  public abstract redrawWithAnimation(): void;

  public getPosition(): IPoint {
    return this.transform.position;
  }

  public setPosition(position: IPoint): void {
    this.transform.position = position;
  }

  public abstract setScale(scale: number, toPosition: IPoint): void;

  public abstract resetScale(): void;

  public emitCanvasChangeEvent(): void {
    this.fCanvasChange.emit(
        new FCanvasChangeEvent(PointExtensions.sum(this.transform.position, this.transform.scaledPosition), this.transform.scale)
    );
  }
}
