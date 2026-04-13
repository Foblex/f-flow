import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { ApplyConnectionRenderRequest } from '../apply-connection-render';
import { MarkConnectionConnectorsAsConnectedRequest } from '../mark-connection-connectors-as-connected';
import { RenderConnectionWithLineRequest } from './render-connection-with-line-request';

@Injectable()
@FExecutionRegister(RenderConnectionWithLineRequest)
export class RenderConnectionWithLine implements IExecution<RenderConnectionWithLineRequest, void> {
  private readonly _mediator = inject(FMediator);

  public handle({ connection, source, target, line }: RenderConnectionWithLineRequest): void {
    this._mediator.execute<void>(new MarkConnectionConnectorsAsConnectedRequest(source, target));
    this._mediator.execute<void>(new ApplyConnectionRenderRequest(connection, line));
  }
}
