import { Component, ElementRef, inject, input, numberAttribute, OnDestroy, OnInit } from '@angular/core';
import { F_LINE_ALIGNMENT, FLineAlignmentBase } from './f-line-alignment-base';
import {
  RemoveLineAlignmentFromStoreRequest,
  AddLineAlignmentToStoreRequest,
} from '../domain';
import { FMediator } from '@foblex/mediator';

@Component({
  selector: "f-line-alignment",
  template: "",
  styleUrls: [ "./f-line-alignment.component.scss" ],
  exportAs: "fComponent",
  host: {
    'class': 'f-line-alignment f-component',
  },
  providers: [
    { provide: F_LINE_ALIGNMENT, useExisting: FLineAlignmentComponent },
  ],
})
export class FLineAlignmentComponent
  extends FLineAlignmentBase implements OnInit, OnDestroy {

  public override fAlignThreshold = input<number, unknown>(10, { transform: numberAttribute });

  private readonly _fMediator = inject(FMediator);
  private readonly _elementReference = inject(ElementRef);

  public override get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }

  public ngOnInit(): void {
    this._fMediator.execute(new AddLineAlignmentToStoreRequest(this));
  }

  public ngOnDestroy(): void {
    this._fMediator.execute(new RemoveLineAlignmentFromStoreRequest());
  }
}
