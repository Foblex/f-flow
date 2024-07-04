import {
  ChangeDetectionStrategy,
  Component, ElementRef
} from "@angular/core";
import { IHasHostElement, IPoint } from '@foblex/core';

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

  public redraw(point: IPoint): void {
    this.hostElement.setAttribute('cx', point.x.toString());
    this.hostElement.setAttribute('cy', point.y.toString());
  }
}

