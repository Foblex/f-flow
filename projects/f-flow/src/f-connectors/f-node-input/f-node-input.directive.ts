import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BooleanExtensions } from '@foblex/core';
import { F_NODE_INPUT, FNodeInputBase } from './f-node-input-base';
import { EFConnectableSide } from '../e-f-connectable-side';
import { FNodeBase, F_NODE } from '../../f-node';
import { FComponentsStore } from '../../f-storage';
import { castToConnectableSide } from '../cast-to-connectable-side';

let uniqueId: number = 0;

@Directive({
  selector: "[fNodeInput]",
  exportAs: 'fNodeInput',
  host: {
    '[attr.data-f-input-id]': 'id',
    class: "f-component f-node-input",
    '[class.f-node-input-multiple]': 'multiple',
    '[class.f-node-input-disabled]': 'disabled',
    '[class.f-node-input-not-connectable]': '!canBeConnected',
  },
  providers: [ { provide: F_NODE_INPUT, useExisting: FNodeInputDirective } ],
})
export class FNodeInputDirective extends FNodeInputBase implements OnInit, OnDestroy {

  @Input('fInputId')
  public override id: any = `f-node-input-${ uniqueId++ }`;

  @Input('fInputMultiple')
  public override multiple: boolean = true;

  @Input('fInputDisabled')
  public override get disabled(): boolean {
    return this.isDisabled;
  }

  public override set disabled(isDisabled: boolean | undefined | string) {
    const value = BooleanExtensions.castToBoolean(isDisabled);
    if (value !== this.isDisabled) {
      this.isDisabled = value;
      this.stateChanges.next();
    }
  }

  private isDisabled: boolean = false;

  @Input('fInputConnectableSide')
  public set _fSide(value: EFConnectableSide | string) {
    this._fConnectableSide = castToConnectableSide(value);
    this.fNode.refresh();
  }

  public get _fSide(): EFConnectableSide {
    return this._fConnectableSide;
  }

  public override _fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public override isConnected: boolean = false;

  public get hostElement(): HTMLElement | SVGElement {
    return this.elementReference.nativeElement;
  }

  constructor(
      private elementReference: ElementRef<HTMLElement>,
      @Inject(F_NODE) private fNode: FNodeBase,
      private fComponentsStore: FComponentsStore,
  ) {
    super();
  }

  public ngOnInit() {
    this.fComponentsStore.addComponent(this.fComponentsStore.fInputs, this);
    this.fNode.addConnector(this);
  }

  public override setConnected(isConnected: boolean): void {
    this.isConnected = isConnected;
    this.hostElement.classList.toggle('f-node-input-connected', isConnected);
  }

  public ngOnDestroy(): void {
    this.fNode.removeConnector(this);
    this.fComponentsStore.removeComponent(this.fComponentsStore.fInputs, this);
  }
}
