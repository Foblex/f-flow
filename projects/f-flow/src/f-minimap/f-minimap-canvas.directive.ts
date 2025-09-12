import {
  Directive, ElementRef, inject,
} from "@angular/core";
import { FMediator } from '@foblex/mediator';
import { MinimapDrawNodesRequest } from './domain';

@Directive({
  selector: 'g[fMinimapCanvas]',
})
export class FMinimapCanvasDirective {

  private readonly _mediator = inject(FMediator);
  private readonly _elementReference = inject(ElementRef);

  public get hostElement(): SVGGElement {
    return this._elementReference.nativeElement;
  }

  public redraw(): void {
    this._clearCanvas();

    this._mediator.execute<SVGRectElement[]>(new MinimapDrawNodesRequest()).forEach((x) => {
      this.hostElement.appendChild(x);
    });
  }

  private _clearCanvas(): void {
    this.hostElement.innerHTML = '';
  }
}
