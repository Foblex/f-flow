import { FExecutionRegister, FMediator, IHandler } from '@foblex/mediator';
import { IPoint } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { CreateConnectionFromConnectorPreparationRequest } from './create-connection-from-connector-preparation-request';
import { FComponentsStore } from '../../../../../f-storage';
import {
  FConnectorDirective,
  FSourceConnectorBase,
  getAllSourceConnectors,
  isOutletConnector,
} from '../../../../../f-connectors';
import { ResolveConnectableOutputForOutletRequest } from '../../resolve-connectable-output-for-outlet';
import { CreateConnectionCreateDragHandlerRequest } from '../create-drag-handler';
import { FNodeBase } from '../../../../../f-node';
import { IPointerEvent } from '../../../../infrastructure';

/**
 * Starts a drag-to-connect from a `[fConnector]`. Connectors with type
 * `source`/`source-target` start the connection themselves; `outlet` connectors
 * act as a shared start surface and resolve to a real source connector.
 * `target` connectors cannot start a connection.
 */
@Injectable()
@FExecutionRegister(CreateConnectionFromConnectorPreparationRequest)
export class CreateConnectionFromConnectorPreparation implements IHandler<
  CreateConnectionFromConnectorPreparationRequest,
  void
> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  public handle({ event, node }: CreateConnectionFromConnectorPreparationRequest): void {
    const connector = this._findConnector(event.targetElement);
    if (!connector || connector.disabled()) {
      return;
    }

    const type = connector.fConnectorType();
    if (type === 'target') {
      return;
    }

    if (type === 'outlet') {
      this._prepareFromOutlet(event, node, connector);

      return;
    }

    // The outlet is the node's shared start surface; direct source drags are routed through it.
    if (this._hasOutletInNode(node) || !connector.canBeConnected) {
      return;
    }

    this._startDrag(event.getPosition(), connector);
  }

  private _prepareFromOutlet(
    event: IPointerEvent,
    node: FNodeBase,
    outlet: FConnectorDirective,
  ): void {
    outlet.setOutletSources(this._findSourcesInNode(node));
    if (!outlet.canBeConnected) {
      return;
    }

    const source = outlet.fConnectionFromOutlet() ? outlet : this._resolveSourceForOutlet(outlet);
    if (!source || !source.canBeConnected) {
      return;
    }

    this._startDrag(event.getPosition(), source);
  }

  private _findConnector(target: HTMLElement | SVGElement): FConnectorDirective | undefined {
    return this._store.connectors
      .getAll()
      .find(
        (x): x is FConnectorDirective =>
          x instanceof FConnectorDirective && x.hostElement.contains(target),
      );
  }

  private _findSourcesInNode(node: FNodeBase): FSourceConnectorBase[] {
    return getAllSourceConnectors(this._store).filter((x) => node.isContains(x.hostElement));
  }

  private _hasOutletInNode(node: FNodeBase): boolean {
    return (
      this._store.outlets.getAll().some((x) => node.isContains(x.hostElement)) ||
      this._store.connectors
        .getAll()
        .some((x) => isOutletConnector(x) && node.isContains(x.hostElement))
    );
  }

  private _resolveSourceForOutlet(outlet: FConnectorDirective): FSourceConnectorBase | undefined {
    return this._mediator.execute<FSourceConnectorBase | undefined>(
      new ResolveConnectableOutputForOutletRequest(outlet),
    );
  }

  private _startDrag(position: IPoint, source: FSourceConnectorBase): void {
    this._mediator.execute<void>(new CreateConnectionCreateDragHandlerRequest(position, source));
  }
}
