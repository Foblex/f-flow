import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, SimpleChanges
} from '@angular/core';
import { F_NODE_INPUT, FNodeInputBase } from './f-node-input-base';
import { EFConnectableSide } from '../e-f-connectable-side';
import { F_NODE } from '../../f-node';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddInputToStoreRequest, F_CSS_CLASS, RemoveInputFromStoreRequest } from '../../domain';
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

  private _elementReference = inject(ElementRef);
  private _fMediator = inject(FMediator);
  private _fNode = inject(F_NODE);

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

  public override get fNodeId(): string {
    return this._fNode.fId();
  }

  public get hostElement(): HTMLElement | SVGElement {
    return this._elementReference.nativeElement;
  }

  public ngOnInit() {
    this._fMediator.execute(new AddInputToStoreRequest(this));
    this._fNode.addConnector(this);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes[ 'userFConnectableSide' ]) {
      this._fNode.refresh();
    }
  }

  public override setConnected(toConnector: FConnectorBase): void {
    super.setConnected(toConnector);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.INPUT_CONNECTED, true);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.INPUT_NOT_CONNECTABLE, !this.canBeConnected);
  }

  public override resetConnected(): void {
    super.resetConnected();
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.INPUT_CONNECTED, false);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.INPUT_NOT_CONNECTABLE, !this.canBeConnected);
  }

  public ngOnDestroy(): void {
    this._fNode.removeConnector(this);
    this._fMediator.execute(new RemoveInputFromStoreRequest(this));
  }
}
