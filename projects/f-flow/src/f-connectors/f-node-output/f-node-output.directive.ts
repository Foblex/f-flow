import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BooleanExtensions } from '@foblex/core';
import { FNodeOutputBase, F_NODE_OUTPUT } from './f-node-output-base';
import { EFConnectableSide } from '../e-f-connectable-side';
import { F_NODE, FNodeBase } from '../../f-node';
import { FComponentsStore } from '../../f-storage';
import { castToConnectableSide } from '../cast-to-connectable-side';

let uniqueId: number = 0;

@Directive({
  selector: "[fNodeOutput]",
  exportAs: 'fNodeOutput',
  host: {
    '[attr.data-f-output-id]': 'id',
    class: "f-component f-node-output",
    '[class.f-node-output-disabled]': 'disabled',
  },
  providers: [ { provide: F_NODE_OUTPUT, useExisting: FNodeOutputDirective } ],
})
export class FNodeOutputDirective extends FNodeOutputBase implements OnInit, OnDestroy {

  @Input('fOutputId')
  public override id: string = `f-node-output-${ uniqueId++ }`;

  @Input('fOutputMultiple')
  public override multiple: boolean = false;

  @Input('fOutputDisabled')
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

  @Input('fOutputConnectableSide')
  public set _fSide(value: EFConnectableSide | string) {
    this._fConnectableSide = castToConnectableSide(value);
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
    if (!this.fNode) {
      throw new Error('fNodeOutput must be inside fNode Directive');
    }
    this.fComponentsStore.addComponent(this.fComponentsStore.fOutputs, this);
    this.fNode.addConnector(this);
  }

  public override setConnected(isConnected: boolean): void {
    this.isConnected = isConnected;
    this.hostElement.classList.toggle('f-node-output-connected', isConnected);
  }

  public ngOnDestroy(): void {
    this.fNode.removeConnector(this);
    this.fComponentsStore.removeComponent(this.fComponentsStore.fOutputs, this);
  }
}
