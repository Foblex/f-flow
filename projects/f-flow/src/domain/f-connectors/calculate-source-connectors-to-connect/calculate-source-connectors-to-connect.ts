import { CalculateSourceConnectorsToConnectRequest } from './calculate-source-connectors-to-connect-request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FConnectorBase, FNodeInputBase, FNodeOutputBase } from '../../../f-connectors';
import { FComponentsStore } from '../../../f-storage';
import { IConnectorRectRef } from '../i-connector-rect-ref';
import { GetConnectorRectReferenceRequest } from '../get-connector-rect-reference';
import { IPoint } from '@foblex/2d';
import { CalculateConnectableSideByConnectedPositionsRequest, isCalculateMode } from '../../f-node';
import { EFConnectableSide } from '../../../f-connection-v2';

/**
 * Returns all source connectors (outputs/outlets) that can connect to the given target input,
 * along with their rect references.
 */
@Injectable()
@FExecutionRegister(CalculateSourceConnectorsToConnectRequest)
export class CalculateSourceConnectorsToConnect
  implements IExecution<CalculateSourceConnectorsToConnectRequest, IConnectorRectRef[]>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _sources(): FNodeOutputBase[] {
    return this._store.fOutputs as FNodeOutputBase[];
  }

  public handle({
    target,
    pointer,
  }: CalculateSourceConnectorsToConnectRequest): IConnectorRectRef[] {
    const sources = this._getConnectableSources(target);

    const refs: IConnectorRectRef[] = [];
    for (const connector of sources) {
      refs.push(
        this._mediator.execute<IConnectorRectRef>(new GetConnectorRectReferenceRequest(connector)),
      );
    }

    this._scheduleApplyCalculatedSides(refs, pointer);

    return refs;
  }

  private _getConnectableSources(target: FNodeInputBase): FConnectorBase[] {
    return this._sources.filter((x) => {
      let result = x.canBeConnected;
      if (result && x.hasConnectionLimits) {
        result = x.canConnectTo(target);
      }

      return result;
    });
  }

  private _scheduleApplyCalculatedSides(refs: IConnectorRectRef[], pointer: IPoint): void {
    queueMicrotask(() => this._applyCalculatedConnectableSides(refs, pointer));
  }

  private _applyCalculatedConnectableSides(
    refs: readonly IConnectorRectRef[],
    pointer: IPoint,
  ): void {
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
