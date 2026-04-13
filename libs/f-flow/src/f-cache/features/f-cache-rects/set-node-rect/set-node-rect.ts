import { inject, Injectable } from '@angular/core';
import { IRect, RectExtensions, RoundedRect } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { SetFCacheNodeRectRequest } from './set-node-rect-request';
import { FCache } from '../../../model';
import { F_CACHE_OPTIONS } from '../../../config';

@Injectable()
@FExecutionRegister(SetFCacheNodeRectRequest)
export class SetFCacheNodeRect implements IExecution<SetFCacheNodeRectRequest, void> {
  private readonly _store = inject(FCache);
  private readonly _options = inject(F_CACHE_OPTIONS);

  public handle({ nodeId, rect }: SetFCacheNodeRectRequest): void {
    if (!this._options.enabled) {
      return;
    }

    const node = this._store.nodeEntries.get(nodeId);
    if (!node) {
      return;
    }

    const previousRect = node.rect;
    node.rect = RectExtensions.initialize(rect.x, rect.y, rect.width, rect.height);

    if (!previousRect) {
      return;
    }

    this._updateConnectorRectsByNodeRect(nodeId, previousRect, node.rect);
  }

  private _updateConnectorRectsByNodeRect(
    nodeId: string,
    previousRect: IRect,
    nextRect: IRect,
  ): void {
    const connectorKeys = this._store.connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys?.size) {
      return;
    }

    const dx = nextRect.x - previousRect.x;
    const dy = nextRect.y - previousRect.y;

    const hasScaleX = previousRect.width !== 0;
    const hasScaleY = previousRect.height !== 0;
    const scaleX = hasScaleX ? nextRect.width / previousRect.width : 1;
    const scaleY = hasScaleY ? nextRect.height / previousRect.height : 1;

    for (const key of connectorKeys) {
      const connector = this._store.connectorEntries.get(key);
      if (!connector?.rect) {
        continue;
      }

      const previousConnectorRect = connector.rect;
      const previousCenter = previousConnectorRect.gravityCenter;

      const nextCenterX = hasScaleX
        ? nextRect.x + (previousCenter.x - previousRect.x) * scaleX
        : previousCenter.x + dx;
      const nextCenterY = hasScaleY
        ? nextRect.y + (previousCenter.y - previousRect.y) * scaleY
        : previousCenter.y + dy;

      connector.rect = new RoundedRect(
        nextCenterX - previousConnectorRect.width / 2,
        nextCenterY - previousConnectorRect.height / 2,
        previousConnectorRect.width,
        previousConnectorRect.height,
        previousConnectorRect.radius1,
        previousConnectorRect.radius2,
        previousConnectorRect.radius3,
        previousConnectorRect.radius4,
      );
    }
  }
}
