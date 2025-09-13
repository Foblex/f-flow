import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FNodeOutputBase, F_NODE_OUTPUT } from './f-node-output-base';
import { EFConnectableSide } from '../e-f-connectable-side';
import { F_NODE } from '../../f-node';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddOutputToStoreRequest, F_CSS_CLASS, RemoveOutputFromStoreRequest } from '../../domain';
import { FConnectorBase } from '../f-connector-base';

let uniqueId = 0;

@Directive({
  selector: '[fNodeOutput]',
  exportAs: 'fNodeOutput',
  host: {
    '[attr.data-f-output-id]': 'fId',
    class: 'f-component f-node-output',
    '[class.f-node-output-multiple]': 'multiple',
    '[class.f-node-output-disabled]': 'disabled',
    '[class.f-node-output-self-connectable]': 'isSelfConnectable',
  },
  providers: [{ provide: F_NODE_OUTPUT, useExisting: FNodeOutputDirective }],
})
export class FNodeOutputDirective extends FNodeOutputBase implements OnInit, OnChanges, OnDestroy {
  public readonly hostElement = inject(ElementRef).nativeElement;

  private readonly _mediator = inject(FMediator);
  private readonly _node = inject(F_NODE);

  @Input('fOutputId')
  public override fId: string = `f-node-output-${uniqueId++}`;

  @Input('fOutputMultiple')
  public override multiple: boolean = false;

  @Input({ alias: 'fOutputDisabled', transform: booleanAttribute })
  public override disabled: boolean = false;

  @Input({
    alias: 'fOutputConnectableSide',
    transform: (value: unknown) => castToEnum(value, 'fOutputConnectableSide', EFConnectableSide),
  })
  public override userFConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  @Input()
  public override isSelfConnectable: boolean = true;

  @Input({ alias: 'fCanBeConnectedInputs' })
  public override canBeConnectedInputs: string[] = [];

  public override get fNodeId(): string {
    return this._node.fId();
  }

  public ngOnInit() {
    this._mediator.execute(new AddOutputToStoreRequest(this));
    this._node.addConnector(this);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['userFConnectableSide']) {
      this._node.refresh();
    }
  }

  public override setConnected(toConnector: FConnectorBase): void {
    super.setConnected(toConnector);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.OUTPUT_CONNECTED, true);
    this.hostElement.classList.toggle(
      F_CSS_CLASS.CONNECTOR.OUTPUT_NOT_CONNECTABLE,
      !this.canBeConnected,
    );
  }

  public override resetConnected(): void {
    super.resetConnected();
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.OUTPUT_CONNECTED, false);
    this.hostElement.classList.toggle(
      F_CSS_CLASS.CONNECTOR.OUTPUT_NOT_CONNECTABLE,
      !this.canBeConnected,
    );
  }

  public ngOnDestroy(): void {
    this._node.removeConnector(this);
    this._mediator.execute(new RemoveOutputFromStoreRequest(this));
  }
}
