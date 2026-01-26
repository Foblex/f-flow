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
  private _waypoints: IPoint[] = [];

  public insert(candidate: IPoint): void {
    const current = this.waypoints().slice();

    this._activeIndex = Math.max(0, Math.min(this.candidates().indexOf(candidate), current.length));

    current.splice(this._activeIndex, 0, { ...candidate });
    this.waypoints.set(current);
    this._waypoints = current;
  }

  public select(waypoint: IPoint): void {
    this._activeIndex = this.waypoints().findIndex((x) => PointExtensions.isEqual(waypoint, x));
    this._waypoints = this.waypoints();
  }

  public move(point: IPoint): void {
    this._waypoints[this._activeIndex] = { ...point };
  }

  public update(): void {
    this.waypoints.set([...this._waypoints]);
  }
}
