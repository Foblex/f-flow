import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  input,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { castToEnum } from '@foblex/utils';
import { FMediator } from '@foblex/mediator';
import { injectConnectorNode } from '../inject-connector-node';
import {
  AddConnectorToStoreRequest,
  F_CSS_CLASS,
  RemoveConnectorFromStoreRequest,
} from '../../domain';
import { FConnectorBase, FConnectorKind } from '../f-connector-base';
import { FSourceConnectorBase } from '../f-source-connector-base';
import { castToConnectorType, FConnectorType } from './f-connector-type';
import { stringAttribute } from '../../utils';
import { EFConnectableSide } from '../../f-connection-v2';

let uniqueId = 0;

export const F_CONNECTOR = new InjectionToken<FConnectorDirective>('F_CONNECTOR');

/**
 * Unified connector that replaces the legacy `fNodeInput`/`fNodeOutput`/`fNodeOutlet`
 * directives. A connector has exactly one id; its behavior is controlled by
 * `fConnectorType`:
 *
 * - `source` — can start a connection and be used as `fSourceId`;
 * - `target` — can accept a connection and be used as `fTargetId`;
 * - `source-target` (default) — one id supports both behaviors;
 * - `outlet` — a shared start surface: it can start a drag-to-connect, but the
 *   persisted connection uses the id of a real source connector resolved inside
 *   the same node.
 */
@Directive({
  standalone: false,
  selector: '[fConnector]',
  exportAs: 'fConnector',
  host: {
    '[attr.data-f-connector-id]': 'fId()',
    '[attr.data-f-connector-type]': 'fConnectorType()',
    class: 'f-component f-connector',
    '[class.f-connector-source]': 'fConnectorType() === "source"',
    '[class.f-connector-target]': 'fConnectorType() === "target"',
    '[class.f-connector-source-target]': 'fConnectorType() === "source-target"',
    '[class.f-connector-outlet]': 'fConnectorType() === "outlet"',
    '[class.f-connector-multiple]': 'multiple()',
    '[class.f-connector-disabled]': 'disabled()',
  },
  providers: [{ provide: F_CONNECTOR, useExisting: FConnectorDirective }],
})
export class FConnectorDirective
  extends FSourceConnectorBase
  implements OnInit, OnChanges, OnDestroy
{
  public readonly hostElement = inject(ElementRef).nativeElement;

  private readonly _mediator = inject(FMediator);
  private readonly _node = injectConnectorNode('[fConnector]');

  public override readonly kind: FConnectorKind = 'connector';

  public override fId = input<string, unknown>(`f-connector-${uniqueId++}`, {
    alias: 'fConnectorId',
    transform: (value) => stringAttribute(value) || `f-connector-${uniqueId++}`,
  });

  public readonly fConnectorType = input<FConnectorType, unknown>('source-target', {
    transform: castToConnectorType,
  });

  public override disabled = input<boolean, unknown>(false, {
    alias: 'fConnectorDisabled',
    transform: booleanAttribute,
  });

  public readonly multiple = input<boolean, unknown>(true, {
    alias: 'fConnectorMultiple',
    transform: booleanAttribute,
  });

  public override category = input<string | undefined, unknown>(undefined, {
    alias: 'fConnectorCategory',
    transform: stringAttribute,
  });

  @Input({
    alias: 'fConnectorConnectableSide',
    transform: (value: unknown) =>
      castToEnum(value, 'fConnectorConnectableSide', EFConnectableSide),
  })
  public override userFConnectableSide: EFConnectableSide = EFConnectableSide.AUTO;

  @Input({ alias: 'fConnectorSelfConnectable', transform: booleanAttribute })
  public override isSelfConnectable: boolean = false;

  /**
   * Source and outlet connection limits: ids or categories of target connectors
   * this connector is allowed to connect to. Replaces the legacy `fCanBeConnectedInputs`.
   */
  public readonly fCanBeConnectedTo = input<string[]>([]);

  /**
   * Outlet-only: when `true`, the connection preview starts visually from the
   * outlet rect. The emitted `FCreateConnectionEvent.sourceId` is always the
   * resolved real source connector id.
   */
  public readonly fConnectionFromOutlet = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  public override get canBeConnectedInputs(): string[] {
    return this.fCanBeConnectedTo();
  }

  private _outletSources: FConnectorBase[] = [];

  public override get canBeConnected(): boolean {
    if (this.disabled()) {
      return false;
    }

    if (this.fConnectorType() === 'outlet') {
      return this._outletSources.some((x) => x.canBeConnected);
    }

    return this.multiple() ? true : !this.isConnected;
  }

  /** Outlet-only: source connectors of the same node the outlet delegates to. */
  public setOutletSources(sources: FConnectorBase[]): void {
    this._outletSources = sources;
  }

  public override get fNodeId(): string {
    return this._node.fId();
  }

  public override get fNodeHost(): HTMLElement | SVGElement {
    return this._node.hostElement;
  }

  public ngOnInit(): void {
    this._mediator.execute(new AddConnectorToStoreRequest(this));
    if (this.fConnectorType() !== 'outlet') {
      this._node.addConnector(this);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['userFConnectableSide']) {
      this._node.refresh();
    }
  }

  public override setConnected(toConnector: FConnectorBase): void {
    super.setConnected(toConnector);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.CONNECTED, true);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.NOT_CONNECTABLE, !this.canBeConnected);
  }

  public override resetConnected(): void {
    super.resetConnected();
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.CONNECTED, false);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.NOT_CONNECTABLE, !this.canBeConnected);
  }

  public ngOnDestroy(): void {
    if (this.fConnectorType() !== 'outlet') {
      this._node.removeConnector(this);
    }
    this._mediator.execute(new RemoveConnectorFromStoreRequest(this));
  }
}
