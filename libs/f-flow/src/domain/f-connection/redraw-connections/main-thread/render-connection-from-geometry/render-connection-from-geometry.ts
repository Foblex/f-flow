import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '../../../../../_libs/f-mediator';
import { BuildConnectionLineRequest } from '../../shared/build-connection-line';
import { RenderConnectionWithLineRequest } from '../render-connection-with-line';
import { RenderConnectionFromGeometryRequest } from './render-connection-from-geometry-request';

@Injectable()
@FExecutionRegister(RenderConnectionFromGeometryRequest)
export class RenderConnectionFromGeometry implements IExecution<
  RenderConnectionFromGeometryRequest,
  void
> {
  private readonly _mediator = inject(FMediator);

  public handle({ connection, geometry }: RenderConnectionFromGeometryRequest): void {
    const line = this._mediator.execute(new BuildConnectionLineRequest(connection, geometry));

    this._mediator.execute(
      new RenderConnectionWithLineRequest(connection, geometry.source, geometry.target, line),
    );
  }
}
