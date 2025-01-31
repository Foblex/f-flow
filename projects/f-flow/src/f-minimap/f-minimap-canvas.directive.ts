import {
  Directive, ElementRef, inject,
} from "@angular/core";
import { FMediator } from '@foblex/mediator';
import { MinimapDrawNodesRequest } from './domain';

@Directive({
  selector: 'g[fMinimapCanvas]'
})
export class FMinimapCanvasDirective {

  private _fMediator = inject(FMediator);

  private _elementReference = inject(ElementRef);

  public get hostElement(): SVGGElement {
    return this._elementReference.nativeElement;
  }

  public redraw(): void {
    this._clearCanvas();

    this._fMediator.execute<SVGRectElement[]>(new MinimapDrawNodesRequest())
      .forEach((x) => {
        this.hostElement.appendChild(x);
      });
  }

  private _clearCanvas(): void {
    this.hostElement.innerHTML = '';
  }
}
