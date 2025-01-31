import {
  Directive, ElementRef, inject, Input, OnInit,
} from "@angular/core";
import { setRectToViewBox } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { FMinimapData, IFMinimapScaleAndViewBox, MinimapCalculateSvgScaleAndViewBoxRequest } from './domain';

@Directive({
  selector: 'svg[fMinimapFlow]'
})
export class FMinimapFlowDirective {

  @Input()
  public fMinSize: number = 1000;

  private _fMediator = inject(FMediator);

  private _elementReference = inject(ElementRef);

  public get hostElement(): SVGSVGElement {
    return this._elementReference.nativeElement;
  }

  public model: FMinimapData = new FMinimapData(this.hostElement);

  public redraw(): void {
    const { scale, viewBox} = this._fMediator.execute<IFMinimapScaleAndViewBox>(
      new MinimapCalculateSvgScaleAndViewBoxRequest(this.hostElement, this.fMinSize)
    );
    this.model = new FMinimapData(this.hostElement, scale, viewBox);

    setRectToViewBox(viewBox, this.hostElement);
  }
}
