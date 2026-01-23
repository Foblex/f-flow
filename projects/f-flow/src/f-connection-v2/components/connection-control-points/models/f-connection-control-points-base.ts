import { ElementRef, inject, InjectionToken, signal, Signal, WritableSignal } from '@angular/core';
import { IControlPointCandidate } from './i-control-point-candidate';
import { IControlPoint } from './i-control-point';
import { IPoint, PointExtensions } from '@foblex/2d';

export const F_CONNECTION_CONTROL_POINTS = new InjectionToken<FConnectionControlPointsBase>(
  'F_CONNECTION_CONTROL_POINTS',
);

export abstract class FConnectionControlPointsBase {
  public readonly hostElement = inject(ElementRef<SVGElement>).nativeElement;

  public abstract candidates: WritableSignal<IControlPointCandidate[]>;

  public readonly pivots = signal<IControlPoint[]>([]);

  public abstract radius: Signal<number>;

  private _activeIndex: number = 0;

  public insert(candidate: IControlPointCandidate): void {
    const current = this.pivots().slice();

    this._activeIndex = Math.max(0, Math.min(candidate.chainIndex, current.length));

    current.splice(this._activeIndex, 0, { ...candidate.point });
    this.pivots.set(current);
  }

  public select(pivot: IPoint): void {
    this._activeIndex = this.pivots().findIndex((x) => PointExtensions.isEqual(pivot, x));
  }

  public move(point: IPoint): void {
    this.pivots.update((x) => {
      x[this._activeIndex] = point;

      return x;
    });
  }
}
