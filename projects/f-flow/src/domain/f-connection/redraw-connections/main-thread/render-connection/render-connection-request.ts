import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../../../f-connection-v2';

export class RenderConnectionRequest {
  static readonly fToken = Symbol('RenderConnectionRequest');

  constructor(
    public connection: FConnectionBase,
    public cache: Map<string, IRoundedRect>,
  ) {}
}
