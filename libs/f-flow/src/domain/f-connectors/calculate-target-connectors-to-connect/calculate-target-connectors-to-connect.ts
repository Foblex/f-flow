import { CalculateTargetConnectorsToConnectRequest } from './calculate-target-connectors-to-connect-request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import {
  FConnectorBase,
  FNodeInputBase,
  FNodeOutletBase,
  FNodeOutputBase,
} from '../../../f-connectors';
import { FComponentsStore } from '../../../f-storage';
import { IConnectorRectRef } from '../i-connector-rect-ref';
import { GetConnectorRectReferenceRequest } from '../get-connector-rect-reference';
import { CalculateConnectableSideByConnectedPositionsRequest, isCalculateMode } from '../../f-node';
import { IPoint } from '@foblex/2d';
import { EFConnectableSide } from '../../../f-connection-v2';

/**
 * Returns all input connectors that can be connected to the given source (output or outlet),
 * along with their rect references.
 */
@Injectable()
@FExecutionRegister(CalculateTargetConnectorsToConnectRequest)
export class CalculateTargetConnectorsToConnect
  implements IExecution<CalculateTargetConnectorsToConnectRequest, IConnectorRectRef[]>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _targets(): FNodeInputBase[] {
    return this._store.inputs.getAll();
  }

  public handle({
    source,
    pointer,
  }: CalculateTargetConnectorsToConnectRequest): IConnectorRectRef[] {
    const targets = this._getConnectableTargets(source);

    const refs: IConnectorRectRef[] = [];
    for (const input of targets) {
      refs.push(
        this._mediator.execute<IConnectorRectRef>(new GetConnectorRectReferenceRequest(input)),
      );
    }

    this._scheduleApplyCalculatedSides(refs, pointer);

    return refs;
  }

  private _getConnectableTargets(source: FNodeOutputBase | FNodeOutletBase): FConnectorBase[] {
    // 1) Connection limits (strict whitelist)
    if (source.hasConnectionLimits) {
      return this._targets.filter((x) => source.canConnectTo(x));
    }

    // 2) Basic connectable filter
    let targets = this._targets.filter((x) => x.canBeConnected);

    // 3) Self-connection rule
    if (!source.isSelfConnectable) {
      targets = targets.filter((x) => x.fNodeId !== source.fNodeId);
    }

    return targets;
  }

  private _scheduleApplyCalculatedSides(refs: IConnectorRectRef[], pointer: IPoint): void {
    queueMicrotask(() => this._applyCalculatedConnectableSides(refs, pointer));
  }

  private _applyCalculatedConnectableSides(refs: IConnectorRectRef[], pointer: IPoint): void {
    for (const { connector } of refs) {
      if (!isCalculateMode(connector.userFConnectableSide)) continue;
      connector.fConnectableSide = this._calculateByConnectedPositions(connector, pointer);
    }
  }

  /** Delegates to the connected-positions calculation execution. */
  private _calculateByConnectedPositions(
    connector: FConnectorBase,
    pointer: IPoint,
  ): EFConnectableSide {
    return this._mediator.execute(
      new CalculateConnectableSideByConnectedPositionsRequest(connector, pointer),
    );
  }
}
