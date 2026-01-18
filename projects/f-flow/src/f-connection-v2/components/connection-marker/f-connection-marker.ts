import { Directive, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FMediator } from '@foblex/mediator';
import { F_CONNECTION_MARKER, FConnectionMarkerBase } from './models';
import { EFMarkerType } from './enums';
import {
  AddConnectionMarkerToStoreRequest,
  RemoveConnectionMarkerFromStoreRequest,
} from '../../../domain';

@Directive({
  selector: 'svg[fMarker]',
  host: {
    class: 'f-component f-marker',
  },
  providers: [{ provide: F_CONNECTION_MARKER, useExisting: FConnectionMarker }],
})
export class FConnectionMarker extends FConnectionMarkerBase implements OnInit, OnDestroy {
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
