import { Directive, ElementRef, inject, input } from '@angular/core';
import { setRectToViewBox } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { FMinimapState, IMinimapViewport, MinimapCalculateViewportRequest } from '../domain';

@Directive({
  selector: 'svg[fMinimapFlow]',
  standalone: true,
})
export class FMinimapFlowDirective {
  public readonly fMinSize = input<number>(1000);

  private readonly _mediator = inject(FMediator);
  public readonly hostElement = inject(ElementRef<SVGSVGElement>).nativeElement;

  public model = new FMinimapState(this.hostElement);

  public redraw(): void {
    const { scale, viewBox } = this._mediator.execute<IMinimapViewport>(
      new MinimapCalculateViewportRequest(this.hostElement, this.fMinSize()),
    );
    this.model = new FMinimapState(this.hostElement, scale, viewBox);

    setRectToViewBox(viewBox, this.hostElement);
  }
}
