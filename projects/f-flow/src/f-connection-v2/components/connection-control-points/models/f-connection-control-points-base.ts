import {
  computed,
  ElementRef,
  inject,
  InjectionToken,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { IControlPoint, IControlPointCandidate } from './i-control-point';
import { IPoint } from '@foblex/2d';

export const F_CONNECTION_CONTROL_POINTS = new InjectionToken<FConnectionControlPointsBase>(
  'F_CONNECTION_CONTROL_POINTS',
);

export abstract class FConnectionControlPointsBase {
  public readonly hostElement = inject(ElementRef<SVGElement>).nativeElement;

  public readonly points = signal<IPoint[]>([]);
  public abstract candidates: WritableSignal<IControlPointCandidate[]>;

  private readonly _pivots = signal<IControlPoint[]>([]);

  public pivots(): IControlPoint[] {
    return this._pivots();
  }

  public readonly userPivots: Signal<IControlPoint[]> = computed(() =>
    this._pivots().filter((p) => p.userDefined),
  );

  private _dragPivotId: string | null = null;

  public abstract radius: Signal<number>;

  public addPivotFromCandidateOrdered(candidate: IControlPointCandidate): IControlPoint {
    const pivot: IControlPoint = {
      id: uid(),
      userDefined: true,
      point: { x: candidate.point.x, y: candidate.point.y },
    };

    const current = this._pivots().slice();

    const idx = Math.max(0, Math.min(candidate.chainIndex, current.length));

    current.splice(idx, 0, pivot);
    this._pivots.set(current);

    return pivot;
  }

  public startDragPivot(pivotId: string): void {
    this._dragPivotId = pivotId;
  }

  public dragPivotTo(point: IPoint): void {
    if (!this._dragPivotId) return;

    const pivots = this._pivots().slice();
    const idx = pivots.findIndex((p) => p.id === this._dragPivotId);
    if (idx === -1) return;

    const prev = pivots[idx];

    pivots[idx] = {
      ...prev,
      userDefined: true,
      point: { x: point.x, y: point.y },
    };

    this._pivots.set(pivots);
  }

  public endDragPivot(): void {
    this._dragPivotId = null;
  }

  public startDragCandidate(candidate: IControlPointCandidate): string {
    const pivot = this.addPivotFromCandidateOrdered(candidate);
    this.startDragPivot(pivot.id!);

    return pivot.id!;
  }

  public removePivot(pivotId: string): void {
    this._pivots.set(this._pivots().filter((p) => p.id !== pivotId));
  }
}

function uid(): string {
  // простой id, без crypto
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
