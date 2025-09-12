import {
  ChangeDetectionStrategy,
  Component, ElementRef, inject,
} from "@angular/core";
import { IPoint } from '@foblex/2d';
import { IHasHostElement } from '../../../i-has-host-element';
import { F_CSS_CLASS } from '../../../domain/css-cls';

@Component({
  selector: "circle[f-connection-drag-handle-end]",
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'class',
  },
})
export class FConnectionDragHandleEndComponent implements IHasHostElement {
  private readonly _elementReference = inject(ElementRef);

  protected readonly class: string = F_CSS_CLASS.CONNECTION.DRAG_HANDLE;

  public point!: IPoint;

  public get hostElement(): SVGCircleElement {
    return this._elementReference.nativeElement;
  }

  public redraw(penultimatePoint: IPoint, endPoint: IPoint): void {
    this.point = this._calculateCircleCenter(penultimatePoint, endPoint, 8);
    this.hostElement.setAttribute('cx', this.point.x.toString());
    this.hostElement.setAttribute('cy', this.point.y.toString());
  }

  private _calculateCircleCenter(start: IPoint, end: IPoint, radius: number): IPoint {
    const direction = { x: end.x - start.x, y: end.y - start.y };
    const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y) || 1;
    const unitDirection = { x: direction.x / length, y: direction.y / length };
    const scaledDirection = { x: unitDirection.x * radius, y: unitDirection.y * radius };

    return { x: end.x - scaledDirection.x, y: end.y - scaledDirection.y };
  }
}

