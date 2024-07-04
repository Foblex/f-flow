import { IHandler } from '@foblex/core';
import { IFConnectionBuilderRequest } from './i-f-connection-builder-request';
import { IFConnectionBuilderResponse } from './i-f-connection-builder-response';

export interface IFConnectionBuilder
  extends IHandler<IFConnectionBuilderRequest, IFConnectionBuilderResponse> {

  handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse;
}
