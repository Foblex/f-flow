import { inject, Injectable } from '@angular/core';
import { IRoundedRect } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { UpdateFCacheRectByElementRequest } from './update-rect-by-element-request';
import { FCache } from '../../../model';
import { F_CACHE_OPTIONS } from '../../../config';

@Injectable()
@FExecutionRegister(UpdateFCacheRectByElementRequest)
export class UpdateFCacheRectByElement implements IExecution<
  UpdateFCacheRectByElementRequest,
  void
> {
  private readonly _store = inject(FCache);
  private readonly _options = inject(F_CACHE_OPTIONS);

  public handle({ element, rect }: UpdateFCacheRectByElementRequest): void {
    if (!this._options.enabled) {
      return;
    }

    const nodeId = this._store.nodeIdByElement.get(element);
    if (nodeId) {
      const node = this._store.nodeEntries.get(nodeId);
      if (node) {
        node.rect = rect;
      }

      return;
    }

    const key = this._store.connectorKeyByElement.get(element);
    if (!key) {
      return;
    }

    const connector = this._store.connectorEntries.get(key);
    if (connector) {
      connector.rect = rect as IRoundedRect;
    }
  }
}
