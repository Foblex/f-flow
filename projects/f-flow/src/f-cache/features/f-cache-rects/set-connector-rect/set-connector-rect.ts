import { inject, Injectable } from '@angular/core';
import { RoundedRect } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { SetFCacheConnectorRectRequest } from './set-connector-rect-request';
import { FCache, FCacheConnectorKeyFactory } from '../../../model';
import { F_CACHE_OPTIONS } from '../../../config';

@Injectable()
@FExecutionRegister(SetFCacheConnectorRectRequest)
export class SetFCacheConnectorRect implements IExecution<SetFCacheConnectorRectRequest, void> {
  private readonly _store = inject(FCache);
  private readonly _options = inject(F_CACHE_OPTIONS);

  public handle({ connectorId, kind, rect }: SetFCacheConnectorRectRequest): void {
    if (!this._options.enabled) {
      return;
    }

    const key = FCacheConnectorKeyFactory.build(connectorId, kind);
    const connector = this._store.connectorEntries.get(key);
    if (!connector) {
      return;
    }

    connector.rect = RoundedRect.fromRoundedRect(rect);
  }
}
