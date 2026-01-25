import { ElementRef, inject, InjectionToken, ModelSignal, signal, Signal } from '@angular/core';
import { IWaypointCandidate } from './i-waypoint-candidate';
import { IPoint, PointExtensions } from '@foblex/2d';

export const F_CONNECTION_WAYPOINTS = new InjectionToken<FConnectionWaypointsBase>(
  'F_CONNECTION_WAYPOINTS',
);

export abstract class FConnectionWaypointsBase {
  public readonly hostElement = inject(ElementRef<SVGElement>).nativeElement;

  public readonly candidates = signal<IWaypointCandidate[]>([]);

  public abstract waypoints: ModelSignal<IPoint[]>;
  public abstract radius: Signal<number>;
  public abstract visibility: Signal<boolean>;

  protected _activeIndex = signal(-1)
  private _pivots: IPoint[] = [];

  public insert(candidate: IWaypointCandidate): void {
    const current = this.waypoints().slice();

    this._activeIndex.set(Math.max(0, Math.min(candidate.chainIndex, current.length)));

    current.splice(this._activeIndex(), 0, { ...candidate.point });
    this.waypoints.set(current);
    this._pivots = current;
  }

  public select(pivot: IPoint): void {
    this._activeIndex.set(this.waypoints().findIndex((x) => PointExtensions.isEqual(pivot, x)));
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
    this._activeIndex.set(-1);
  }

  public move(point: IPoint): void {
    this._pivots[this._activeIndex()] = { ...point };
  }

  public update(): void {
    this.waypoints.set([...this._pivots]);
   // this._activeIndex.set(-1);
  }
}
