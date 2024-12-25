import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, SimpleChanges
} from '@angular/core';
import { F_NODE_INPUT, FNodeInputBase } from './f-node-input-base';
import { EFConnectableSide } from '../e-f-connectable-side';
import { FNodeBase, F_NODE } from '../../f-node';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddInputToStoreRequest, RemoveInputFromStoreRequest } from '../../domain';
import { FConnectorBase } from '../f-connector-base';

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
export class FNodeInputDirective extends FNodeInputBase implements OnInit, OnChanges, OnDestroy {

  @Input('fInputId')
  public override fId: any = `f-node-input-${ uniqueId++ }`;

  @Input('fInputMultiple')
  public override multiple: boolean = true;

  @Input({ alias: 'fInputDisabled', transform: booleanAttribute })
  public override disabled: boolean = false;

  @Input({
    alias: 'fInputConnectableSide',
    transform: (value: unknown) => castToEnum(value, 'fInputConnectableSide', EFConnectableSide)
  })
  public override userFConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

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

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes[ 'userFConnectableSide' ]) {
      this.fNode.refresh();
    }
  }

  public override setConnected(isConnected: boolean, toConnector?: FConnectorBase): void {
    super.setConnected(isConnected, toConnector);
    this.hostElement.classList.toggle('f-node-input-connected', isConnected);
    this.hostElement.classList.toggle('f-node-input-not-connectable', !this.canBeConnected);
  }

  public ngOnDestroy(): void {
    this.fNode.removeConnector(this);
    this._fMediator.send(new RemoveInputFromStoreRequest(this));
  }
}
