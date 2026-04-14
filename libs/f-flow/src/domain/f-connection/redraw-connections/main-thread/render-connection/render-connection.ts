import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { ResolveConnectionGeometryRequest } from '../../shared/resolve-connection-geometry';
import { IConnectionGeometry } from '../../models';
import { RenderConnectionFromGeometryRequest } from '../render-connection-from-geometry';
import { RenderConnectionRequest } from './render-connection-request';

@Injectable()
@FExecutionRegister(RenderConnectionRequest)
export class RenderConnection implements IExecution<RenderConnectionRequest, void> {
  private readonly _mediator = inject(FMediator);

  public handle({ connection, cache }: RenderConnectionRequest): void {
    const geometry = this._mediator.execute<IConnectionGeometry | null>(
      new ResolveConnectionGeometryRequest(connection, cache),
    );
    if (!geometry) {
      return;
    }

    this._mediator.execute<void>(new RenderConnectionFromGeometryRequest(connection, geometry));
  }
}
