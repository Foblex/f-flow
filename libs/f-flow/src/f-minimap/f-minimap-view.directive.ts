import { Directive, ElementRef, inject } from '@angular/core';
import { setRectToElement } from '@foblex/2d';
import { FMediator } from '../_libs/f-mediator';
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
      this._mediator.execute(new MinimapCalculateViewRectRequest()),
      this.hostElement,
    );
  }
}
