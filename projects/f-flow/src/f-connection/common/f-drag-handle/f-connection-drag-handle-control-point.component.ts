import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { IPoint } from '@foblex/2d';
import { IHasHostElement } from '../../../i-has-host-element';
import { F_CSS_CLASS } from '../../../domain/css-cls';

@Component({
  selector: 'circle[f-connection-drag-handle-control-point]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'class',
    '[attr.data-index]': 'index()',
  },
})
export class FConnectionDragHandleControlPointComponent implements IHasHostElement {
  private readonly _elementReference = inject(ElementRef);

  protected readonly class: string = F_CSS_CLASS.CONNECTION.DRAG_HANDLE;

  public readonly index = input.required<number>();

  public point!: IPoint;

  public get hostElement(): SVGCircleElement {
    return this._elementReference.nativeElement;
  }

  public redraw(point: IPoint): void {
    this.point = point;
    this.hostElement.setAttribute('cx', point.x.toString());
    this.hostElement.setAttribute('cy', point.y.toString());
  }
}
