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
import { FNodeOutputBase, F_NODE_OUTPUT } from './f-node-output-base';
import { EFConnectableSide } from '../e-f-connectable-side';
import { F_NODE } from '../../f-node';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddOutputToStoreRequest, RemoveOutputFromStoreRequest } from '../../domain';
import { FConnectorBase } from '../f-connector-base';

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
export class FNodeOutputDirective extends FNodeOutputBase implements OnInit, OnChanges, OnDestroy {

  private _elementReference = inject(ElementRef);
  private _fMediator = inject(FMediator);
  private _fNode = inject(F_NODE);

  @Input('fOutputId')
  public override fId: string = `f-node-output-${ uniqueId++ }`;

  @Input('fOutputMultiple')
  public override multiple: boolean = false;

  @Input({ alias: 'fOutputDisabled', transform: booleanAttribute })
  public override disabled: boolean = false;

  @Input({
    alias: 'fOutputConnectableSide',
    transform: (value: unknown) => castToEnum(value, 'fOutputConnectableSide', EFConnectableSide)
  })
  public override userFConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  @Input()
  public override isSelfConnectable: boolean = true;

  public get hostElement(): HTMLElement | SVGElement {
    return this._elementReference.nativeElement;
  }

  public ngOnInit() {
    this._fMediator.send(new AddOutputToStoreRequest(this));
    this._fNode.addConnector(this);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes[ 'userFConnectableSide' ]) {
      this._fNode.refresh();
    }
  }

  public override setConnected(isConnected: boolean, toConnector?: FConnectorBase): void {
    super.setConnected(isConnected, toConnector);
    this.hostElement.classList.toggle('f-node-output-connected', isConnected);
    this.hostElement.classList.toggle('f-node-output-not-connectable', !this.canBeConnected);
  }

  public ngOnDestroy(): void {
    this._fNode.removeConnector(this);
    this._fMediator.send(new RemoveOutputFromStoreRequest(this));
  }
}
