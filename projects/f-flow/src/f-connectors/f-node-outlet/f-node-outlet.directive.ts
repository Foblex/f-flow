import { Directive, ElementRef, inject, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { F_NODE_OUTLET, FNodeOutletBase } from './f-node-outlet-base';
import { F_NODE, FNodeBase } from '../../f-node';
import { EFConnectableSide } from '../e-f-connectable-side';
import { castToBoolean } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddOutletToStoreRequest, RemoveOutletFromStoreRequest } from '../../domain';

let uniqueId: number = 0;

@Directive({
  selector: "[fNodeOutlet]",
  exportAs: 'fNodeOutlet',
  host: {
    '[attr.data-f-outlet-id]': 'fId',
    class: "f-component f-node-outlet",
    '[class.f-node-outlet-disabled]': 'disabled'
  },
  providers: [ { provide: F_NODE_OUTLET, useExisting: FNodeOutletDirective } ],
})
export class FNodeOutletDirective extends FNodeOutletBase implements OnInit, OnDestroy {

  @Input('fOutletId')
  public override fId: string = `f-node-outlet-${ uniqueId++ }`;

  @Input('fOutletDisabled')
  public override get disabled(): boolean {
    return this.isDisabled;
  }

  public override set disabled(isDisabled: boolean | undefined | string) {
    const value = castToBoolean(isDisabled);
    if (value !== this.isDisabled) {
      this.isDisabled = value;
      this.stateChanges.next();
    }
  }

  private isDisabled: boolean = false;

  public override fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public override _fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  @Input()
  public override isConnectionFromOutlet: boolean = false

  public get hostElement(): HTMLElement | SVGElement {
    return this._elementReference.nativeElement;
  }

  private _elementReference = inject(ElementRef);
  private _fMediator = inject(FMediator);

  /// Inject FNodeBase to check if the outlet inside the node
  constructor(
      @Inject(F_NODE) private fNode: FNodeBase
  ) {
    super();
  }

  public ngOnInit() {
    this._fMediator.send(new AddOutletToStoreRequest(this));
  }

  public ngOnDestroy(): void {
    this._fMediator.send(new RemoveOutletFromStoreRequest(this));
  }
}
