import { Directive, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { F_MARKER, FMarkerBase } from './f-marker-base';
import { EFMarkerType } from './e-f-marker-type';
import { FMediator } from '@foblex/mediator';
import {
  AddConnectionMarkerToStoreRequest,
  RemoveConnectionMarkerFromStoreRequest,
} from '../../domain';

@Directive({
  selector: 'svg[fMarker]',
  host: {
    class: 'f-component f-marker',
  },
  providers: [{ provide: F_MARKER, useExisting: FMarkerDirective }],
})
export class FMarkerDirective extends FMarkerBase implements OnInit, OnDestroy {
  public readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly _mediator = inject(FMediator);

  @Input()
  public override width: number = 0;

  @Input()
  public override height: number = 0;

  @Input()
  public override refX: number = 0;

  @Input()
  public override refY: number = 0;

  @Input()
  public override type: string = EFMarkerType.START;

  @Input()
  public override orient: 'auto' | 'auto-start-reverse' | 'calculated' | string = 'auto';

  @Input()
  public override markerUnits: 'strokeWidth' | 'userSpaceOnUse' = 'strokeWidth';

  public ngOnInit(): void {
    this.hostElement.style.display = 'none';
    this._mediator.execute(new AddConnectionMarkerToStoreRequest(this));
  }

  public ngOnDestroy(): void {
    this._mediator.execute(new RemoveConnectionMarkerFromStoreRequest(this));
  }
}
