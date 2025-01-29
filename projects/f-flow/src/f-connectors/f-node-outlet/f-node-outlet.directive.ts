import { booleanAttribute, Directive, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { F_NODE_OUTLET, FNodeOutletBase } from './f-node-outlet-base';
import { F_NODE } from '../../f-node';
import { EFConnectableSide } from '../e-f-connectable-side';
import { FMediator } from '@foblex/mediator';
import { AddOutletToStoreRequest, RemoveOutletFromStoreRequest } from '../../domain';
import { FConnectorBase } from '../f-connector-base';

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

  private _elementReference = inject(ElementRef);
  private _fMediator = inject(FMediator);
  /// Inject FNodeBase to check if the outlet inside the node
  private _fNode = inject(F_NODE);

  @Input('fOutletId')
  public override fId: string = `f-node-outlet-${ uniqueId++ }`;

  @Input({ alias: 'fOutletDisabled', transform: booleanAttribute })
  public override disabled: boolean = false;

  public override fConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public override userFConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  @Input()
  public override isConnectionFromOutlet: boolean = false;

  @Input({ alias: 'fCanBeConnectedInputs' })
  public override canBeConnectedInputs: string[] = [];

  public override get fNodeId(): string {
    return this._fNode.fId;
  }

  public get hostElement(): HTMLElement | SVGElement {
    return this._elementReference.nativeElement;
  }

  public ngOnInit() {
    this._fMediator.send(new AddOutletToStoreRequest(this));
  }

  public ngOnDestroy(): void {
    this._fMediator.send(new RemoveOutletFromStoreRequest(this));
  }
}
