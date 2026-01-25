import { ElementRef, inject, InjectionToken, ModelSignal, signal, Signal } from '@angular/core';
import { IPoint, PointExtensions } from '@foblex/2d';

export const F_CONNECTION_WAYPOINTS = new InjectionToken<FConnectionWaypointsBase>(
  'F_CONNECTION_WAYPOINTS',
);

export abstract class FConnectionWaypointsBase {
  public readonly hostElement = inject(ElementRef<SVGElement>).nativeElement;

  public readonly candidates = signal<IPoint[]>([]);

  public abstract waypoints: ModelSignal<IPoint[]>;
  public abstract radius: Signal<number>;
  public abstract visibility: Signal<boolean>;

  private _activeIndex = 0;
  private _pivots: IPoint[] = [];

  public insert(candidate: IPoint): void {
    const current = this.waypoints().slice();

    this._activeIndex = Math.max(0, Math.min(this.candidates().indexOf(candidate), current.length));

    current.splice(this._activeIndex, 0, { ...candidate });
    this.waypoints.set(current);
    this._pivots = current;
  }

  public select(pivot: IPoint): void {
    this._activeIndex = this.waypoints().findIndex((x) => PointExtensions.isEqual(pivot, x));
    this._pivots = this.waypoints();
  }

  public remove(pivot: IPoint): void {
    const index = this.waypoints().findIndex((x) => PointExtensions.isEqual(pivot, x));
    if (index === -1) {
      throw new Error('Waypoint to delete not found');
    }
    const current = this.waypoints().slice();
    current.splice(index, 1);
    this.waypoints.set(current);
  }

  public move(point: IPoint): void {
    this._pivots[this._activeIndex] = { ...point };
  }

  public update(): void {
    this.waypoints.set([...this._pivots]);
  }
}
