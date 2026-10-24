import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../../../f-connection-v2';

export class RenderConnectionRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RenderConnectionRequest');

  constructor(
    public connection: FConnectionBase,
    public cache: Map<string, IRoundedRect>,
  ) {}
}
