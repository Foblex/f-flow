import { ElementRef, inject, InjectionToken } from '@angular/core';
import { IPoint, PointExtensions } from '@foblex/2d';

export const F_CONNECTION_DRAG_HANDLE_END = new InjectionToken<FConnectionDragHandleBase>(
  'F_CONNECTION_DRAG_HANDLE_END',
);

export const F_CONNECTION_DRAG_HANDLE_START = new InjectionToken<FConnectionDragHandleBase>(
  'F_CONNECTION_DRAG_HANDLE_START',
);

export abstract class FConnectionDragHandleBase {
  public readonly hostElement = inject(ElementRef).nativeElement;

  public point = PointExtensions.initialize();

  protected readonly class = 'f-connection-drag-handle';

  public abstract redraw(penultimatePoint: IPoint, startPoint: IPoint): void;

  protected calculateCircleCenter(start: IPoint, end: IPoint, radius: number): IPoint {
    const direction = { x: end.x - start.x, y: end.y - start.y };
    const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y) || 1;
    const unitDirection = { x: direction.x / length, y: direction.y / length };
    const scaledDirection = { x: unitDirection.x * radius, y: unitDirection.y * radius };

    return { x: end.x - scaledDirection.x, y: end.y - scaledDirection.y };
  }
}
