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

  private readonly _fMediator = inject(FMediator);
  private readonly _elementReference = inject(ElementRef);

  public get hostElement(): SVGGElement {
    return this._elementReference.nativeElement;
  }

  public redraw(): void {
    setRectToElement(
      this._fMediator.execute<IRect>(new MinimapCalculateViewBoxRequest()),
      this.hostElement
    );
  }
}
