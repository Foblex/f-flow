import { ElementRef, inject, InjectionToken, ModelSignal, signal, Signal } from '@angular/core';
import { IPivotCandidate } from './i-pivot-candidate';
import { IPoint, PointExtensions } from '@foblex/2d';

export const F_CONNECTION_CONTROL_POINTS = new InjectionToken<FConnectionControlPointsBase>(
  'F_CONNECTION_CONTROL_POINTS',
);

export abstract class FConnectionControlPointsBase {
  public readonly hostElement = inject(ElementRef<SVGElement>).nativeElement;

  public readonly candidates = signal<IPivotCandidate[]>([]);

  public abstract pivots: ModelSignal<IPoint[]>;
  public abstract radius: Signal<number>;

  private _activeIndex: number = 0;
  private _pivots: IPoint[] = [];

  public insert(candidate: IPivotCandidate): void {
    const current = this.pivots().slice();

    this._activeIndex = Math.max(0, Math.min(candidate.chainIndex, current.length));

    current.splice(this._activeIndex, 0, { ...candidate.point });
    this.pivots.set(current);
    this._pivots = current;
  }

  public select(pivot: IPoint): void {
    this._activeIndex = this.pivots().findIndex((x) => PointExtensions.isEqual(pivot, x));
    this._pivots = this.pivots();
  }

  public move(point: IPoint): void {
    this._pivots[this._activeIndex] = { ...point };
  }

  public update(): void {
    this.pivots.set([...this._pivots]);
  }
}
