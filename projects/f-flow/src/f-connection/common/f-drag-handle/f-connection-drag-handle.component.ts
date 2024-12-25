import {
  ChangeDetectionStrategy,
  Component, ElementRef
} from "@angular/core";
import { IPoint } from '@foblex/2d';
import { IHasHostElement } from '../../../i-has-host-element';

export const F_CONNECTION_DRAG_HANDLE_CLASS = 'f-connection-drag-handle';

@Component({
  selector: "circle[f-connection-drag-handle]",
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'class'
  }
})
export class FConnectionDragHandleComponent implements IHasHostElement {

  public readonly class: string = F_CONNECTION_DRAG_HANDLE_CLASS;

  public get hostElement(): SVGCircleElement {
    return this.elementReference.nativeElement;
  }

  constructor(
    private elementReference: ElementRef<SVGCircleElement>
  ) {
  }

  public redraw(penultimatePoint: IPoint, endPoint: IPoint): void {
    const point = this._calculateCircleCenter(penultimatePoint, endPoint, 8);
    this.hostElement.setAttribute('cx', point.x.toString());
    this.hostElement.setAttribute('cy', point.y.toString());
  }

  private _calculateCircleCenter(start: IPoint, end: IPoint, radius: number): IPoint {
    const direction = { x: end.x - start.x, y: end.y - start.y };
    const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y) || 1;
    const unitDirection = { x: direction.x / length, y: direction.y / length };
    const scaledDirection = { x: unitDirection.x * radius, y: unitDirection.y * radius };
    return { x: end.x - scaledDirection.x, y: end.y - scaledDirection.y };
  }
}

