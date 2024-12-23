import { Directive, ElementRef, inject, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FNodeOutputBase, F_NODE_OUTPUT } from './f-node-output-base';
import { EFConnectableSide } from '../e-f-connectable-side';
import { F_NODE, FNodeBase } from '../../f-node';
import { castToBoolean, castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddOutputToStoreRequest, RemoveOutputFromStoreRequest } from '../../domain';

let uniqueId: number = 0;

@Directive({
  selector: "[fNodeOutput]",
  exportAs: 'fNodeOutput',
  host: {
    '[attr.data-f-output-id]': 'fId',
    class: "f-component f-node-output",
    '[class.f-node-output-multiple]': 'multiple',
    '[class.f-node-output-disabled]': 'disabled',
    '[class.f-node-output-self-connectable]': 'isSelfConnectable',
  },
  providers: [ { provide: F_NODE_OUTPUT, useExisting: FNodeOutputDirective } ],
})
export class FNodeOutputDirective extends FNodeOutputBase implements OnInit, OnDestroy {

  @Input('fOutputId')
  public override fId: string = `f-node-output-${ uniqueId++ }`;

  @Input('fOutputMultiple')
  public override multiple: boolean = false;

  @Input('fOutputDisabled')
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

  @Input('fOutputConnectableSide')
  public set _fSide(value: EFConnectableSide | string) {
    this._fConnectableSide = castToEnum(value, 'fOutputConnectableSide', EFConnectableSide);
    this.fNode.refresh();
  }

  public get _fSide(): EFConnectableSide {
    return this._fConnectableSide;
  }

  public override _fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public override isConnected: boolean = false;

  @Input()
  public override isSelfConnectable: boolean = true;

  public get hostElement(): HTMLElement | SVGElement {
    return this._elementReference.nativeElement;
  }

  private _elementReference = inject(ElementRef);
  private _fMediator = inject(FMediator);

  constructor(
      @Inject(F_NODE) private fNode: FNodeBase
  ) {
    super();
  }

  public ngOnInit() {
    this._fMediator.send(new AddOutputToStoreRequest(this));
    this.fNode.addConnector(this);
  }

  public override setConnected(isConnected: boolean): void {
    this.isConnected = isConnected;
    this.hostElement.classList.toggle('f-node-output-connected', isConnected);
    this.hostElement.classList.toggle('f-node-output-not-connectable', !this.canBeConnected);
  }

  public ngOnDestroy(): void {
    this.fNode.removeConnector(this);
    this._fMediator.send(new RemoveOutputFromStoreRequest(this));
  }
}
