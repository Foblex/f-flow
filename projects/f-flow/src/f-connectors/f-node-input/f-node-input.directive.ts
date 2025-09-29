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
import { F_NODE_INPUT, FNodeInputBase } from './f-node-input-base';
import { EFConnectableSide } from '../e-f-connectable-side';
import { F_NODE } from '../../f-node';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { AddInputToStoreRequest, F_CSS_CLASS, RemoveInputFromStoreRequest } from '../../domain';
import { FConnectorBase } from '../f-connector-base';
import { stringAttribute } from '../../utils';

let uniqueId = 0;

@Directive({
  selector: '[fNodeInput]',
  exportAs: 'fNodeInput',
  host: {
    '[attr.data-f-input-id]': 'fId()',
    class: 'f-component f-node-input',
    '[class.f-node-input-multiple]': 'multiple',
    '[class.f-node-input-disabled]': 'disabled()',
  },
  providers: [{ provide: F_NODE_INPUT, useExisting: FNodeInputDirective }],
})
export class FNodeInputDirective extends FNodeInputBase implements OnInit, OnChanges, OnDestroy {
  public readonly hostElement = inject(ElementRef).nativeElement;

  private readonly _mediator = inject(FMediator);
  private readonly _node = inject(F_NODE);

  public override fId = input<string, unknown>(`f-node-input-${uniqueId++}`, {
    alias: 'fInputId',
    transform: (value) => stringAttribute(value) || `f-node-input-${uniqueId++}`,
  });

  public override category = input<string | undefined, unknown>(undefined, {
    alias: 'fInputCategory',
    transform: stringAttribute,
  });

  public override multiple = input<boolean, unknown>(true, {
    alias: 'fInputMultiple',
    transform: booleanAttribute,
  });

  public override disabled = input<boolean, unknown>(false, {
    alias: 'fInputDisabled',
    transform: booleanAttribute,
  });

  @Input({
    alias: 'fInputConnectableSide',
    transform: (value: unknown) => castToEnum(value, 'fInputConnectableSide', EFConnectableSide),
  })
  public override userFConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  public override get fNodeId(): string {
    return this._node.fId();
  }

  public override get fNodeHost(): HTMLElement | SVGElement {
    return this._node.hostElement;
  }

  public ngOnInit() {
    this._mediator.execute(new AddInputToStoreRequest(this));
    this._node.addConnector(this);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['userFConnectableSide']) {
      this._node.refresh();
    }
  }

  public override setConnected(toConnector: FConnectorBase): void {
    super.setConnected(toConnector);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.INPUT_CONNECTED, true);
    this.hostElement.classList.toggle(
      F_CSS_CLASS.CONNECTOR.INPUT_NOT_CONNECTABLE,
      !this.canBeConnected,
    );
  }

  public override resetConnected(): void {
    super.resetConnected();
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.INPUT_CONNECTED, false);
    this.hostElement.classList.toggle(
      F_CSS_CLASS.CONNECTOR.INPUT_NOT_CONNECTABLE,
      !this.canBeConnected,
    );
  }

  public ngOnDestroy(): void {
    this._node.removeConnector(this);
    this._mediator.execute(new RemoveInputFromStoreRequest(this));
  }
}
