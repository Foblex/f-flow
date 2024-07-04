import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BooleanExtensions } from '@foblex/core';
import { F_NODE_OUTLET, FNodeOutletBase } from './f-node-outlet-base';
import { F_NODE, FNodeBase } from '../../f-node';
import { FComponentsStore } from '../../f-storage';
import { EFConnectableSide } from '../e-f-connectable-side';

let uniqueId: number = 0;

@Directive({
  selector: "[fNodeOutlet]",
  exportAs: 'fNodeOutlet',
  host: {
    '[attr.data-f-outlet-id]': 'id',
    class: "f-component f-node-outlet",
    '[class.f-node-outlet-disabled]': 'disabled'
  },
  providers: [ { provide: F_NODE_OUTLET, useExisting: FNodeOutletDirective } ],
})
export class FNodeOutletDirective extends FNodeOutletBase implements OnInit, OnDestroy {

  @Input('fOutletId')
  public override id: string = `f-node-outlet-${ uniqueId++ }`;

  @Input('fOutletDisabled')
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

  public override fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public override _fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  @Input()
  public override isConnectionFromOutlet: boolean = false

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
      throw new Error('fNodeOutlet must be inside fNode Directive');
    }
    this.fComponentsStore.addComponent(this.fComponentsStore.fOutlets, this);
  }

  public ngOnDestroy(): void {
    this.fComponentsStore.removeComponent(this.fComponentsStore.fOutlets, this);
  }
}
