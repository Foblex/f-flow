import { Directive, ElementRef, inject } from '@angular/core';
import { FMediator } from '@foblex/mediator';
import { MinimapDrawNodesRequest } from '../domain';

@Directive({
  selector: 'g[fMinimapCanvas]',
  standalone: true,
})
export class FMinimapCanvasDirective {
  private readonly _mediator = inject(FMediator);
  private readonly _elementRef = inject(ElementRef<SVGGElement>);
  public readonly hostElement = this._elementRef.nativeElement;

  public redraw(): void {
    this._mediator.execute<void>(new MinimapDrawNodesRequest(this.hostElement));
  }

  public clear(): void {
    this.hostElement.replaceChildren();
  }
}
