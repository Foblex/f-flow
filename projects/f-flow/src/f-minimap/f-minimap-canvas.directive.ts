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
    this.clear();

    const fragment = this._elementRef.nativeElement.ownerDocument.createDocumentFragment();
    this._mediator.execute<SVGRectElement[]>(new MinimapDrawNodesRequest()).forEach((x) => {
      fragment.appendChild(x);
    });
    this.hostElement.appendChild(fragment);
  }

  public clear(): void {
    this.hostElement.replaceChildren();
  }
}
