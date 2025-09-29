import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
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
import { stringAttribute } from '../../utils';

let uniqueId = 0;

@Directive({
  selector: '[fNodeOutput]',
  exportAs: 'fNodeOutput',
  host: {
    '[attr.data-f-output-id]': 'fId()',
    class: 'f-component f-node-output',
    '[class.f-node-output-multiple]': 'multiple',
    '[class.f-node-output-disabled]': 'disabled()',
    '[class.f-node-output-self-connectable]': 'isSelfConnectable',
  },
  providers: [{ provide: F_NODE_OUTPUT, useExisting: FNodeOutputDirective }],
})
export class FNodeOutputDirective extends FNodeOutputBase implements OnInit, OnChanges, OnDestroy {
  public readonly hostElement = inject(ElementRef).nativeElement;

  private readonly _mediator = inject(FMediator);
  private readonly _node = inject(F_NODE);

  public override fId = input<string, unknown>(`f-node-output-${uniqueId++}`, {
    alias: 'fOutputId',
    transform: (value) => stringAttribute(value) || `f-node-output-${uniqueId++}`,
  });

  public override multiple = input<boolean, unknown>(false, {
    alias: 'fOutputMultiple',
    transform: booleanAttribute,
  });

  public override disabled = input<boolean, unknown>(false, {
    alias: 'fOutputDisabled',
    transform: booleanAttribute,
  });

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

  public override get fNodeHost(): HTMLElement | SVGElement {
    return this._node.hostElement;
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
