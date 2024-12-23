import { Directive, ElementRef, inject, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { F_NODE_INPUT, FNodeInputBase } from './f-node-input-base';
import { EFConnectableSide } from '../e-f-connectable-side';
import { FNodeBase, F_NODE } from '../../f-node';
import { castToBoolean, castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddInputToStoreRequest, RemoveInputFromStoreRequest } from '../../domain';

let uniqueId: number = 0;

@Directive({
  selector: "[fNodeInput]",
  exportAs: 'fNodeInput',
  host: {
    '[attr.data-f-input-id]': 'fId',
    class: "f-component f-node-input",
    '[class.f-node-input-multiple]': 'multiple',
    '[class.f-node-input-disabled]': 'disabled'
  },
  providers: [ { provide: F_NODE_INPUT, useExisting: FNodeInputDirective } ],
})
export class FNodeInputDirective extends FNodeInputBase implements OnInit, OnDestroy {

  @Input('fInputId')
  public override fId: any = `f-node-input-${ uniqueId++ }`;

  @Input('fInputMultiple')
  public override multiple: boolean = true;

  @Input('fInputDisabled')
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

  @Input('fInputConnectableSide')
  public set _fSide(value: EFConnectableSide | string) {
    this._fConnectableSide = castToEnum(value, 'fInputConnectableSide', EFConnectableSide);
    this.fNode.refresh();
  }

  public get _fSide(): EFConnectableSide {
    return this._fConnectableSide;
  }

  public override _fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public override isConnected: boolean = false;

  public get hostElement(): HTMLElement | SVGElement {
    return this._elementReference.nativeElement;
  }

  private _elementReference = inject(ElementRef);
  private _fMediator = inject(FMediator);

  constructor(
    @Inject(F_NODE) private fNode: FNodeBase,
  ) {
    super();
  }

  public ngOnInit() {
    this._fMediator.send(new AddInputToStoreRequest(this));
    this.fNode.addConnector(this);
  }

  public override setConnected(isConnected: boolean): void {
    this.isConnected = isConnected;
    this.hostElement.classList.toggle('f-node-input-connected', isConnected);
    this.hostElement.classList.toggle('f-node-input-not-connectable', !this.canBeConnected);
  }

  public ngOnDestroy(): void {
    this.fNode.removeConnector(this);
    this._fMediator.send(new RemoveInputFromStoreRequest(this));
  }
}
