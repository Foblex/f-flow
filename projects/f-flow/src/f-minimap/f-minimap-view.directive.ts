import { Directive, ElementRef, inject } from "@angular/core";
import { IRect, setRectToElement } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { MinimapCalculateViewBoxRequest } from './domain';

@Directive({
  selector: 'rect[fMinimapView]',
  host: {
    'class': 'f-component f-minimap-view',
  }
})
export class FMinimapViewDirective {

  private _fMediator = inject(FMediator);

  private _elementReference = inject(ElementRef);

  public get hostElement(): SVGGElement {
    return this._elementReference.nativeElement;
  }

  public redraw(): void {
    setRectToElement(
      this._fMediator.send<IRect>(new MinimapCalculateViewBoxRequest()),
      this.hostElement
    );
  }
}
