import { inject, Injectable } from '@angular/core';
import { FMediator, IExecution } from '../../../../../_libs/f-mediator';
import { ResolveConnectionGeometryRequest } from '../../shared/resolve-connection-geometry';
import { RenderConnectionFromGeometryRequest } from '../render-connection-from-geometry';
import { RenderConnectionRequest } from './render-connection-request';

@Injectable()
export class RenderConnection implements IExecution<RenderConnectionRequest, void> {
  private readonly _mediator = inject(FMediator);

  public handle({ connection, cache }: RenderConnectionRequest): void {
    const geometry = this._mediator.execute(
      new ResolveConnectionGeometryRequest(connection, cache),
    );
    if (!geometry) {
      return;
    }

    this._mediator.execute(new RenderConnectionFromGeometryRequest(connection, geometry));
  }
}
