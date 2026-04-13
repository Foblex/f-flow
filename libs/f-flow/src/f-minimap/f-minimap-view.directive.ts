import { Directive, ElementRef, inject } from '@angular/core';
import { IRect, setRectToElement } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { MinimapCalculateViewRectRequest } from '../domain';

@Directive({
  selector: 'rect[fMinimapView]',
  host: {
    'class': 'f-component f-minimap-view',
  },
  standalone: true,
})
export class FMinimapViewDirective {
  private readonly _mediator = inject(FMediator);
  public readonly hostElement = inject(ElementRef).nativeElement;

  public redraw(): void {
    setRectToElement(
      this._mediator.execute<IRect>(new MinimapCalculateViewRectRequest()),
      this.hostElement,
    );
  }
}
