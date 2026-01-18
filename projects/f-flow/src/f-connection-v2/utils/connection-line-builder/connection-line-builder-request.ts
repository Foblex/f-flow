import { IFConnectionBuilderRequest } from './models';
import { EFConnectionType } from '../../enums';

export class ConnectionLineBuilderRequest {
  constructor(
    public readonly type: string | EFConnectionType,
    public readonly payload: IFConnectionBuilderRequest,
  ) {}
}
