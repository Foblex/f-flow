import { FConnectionBase } from '../../../f-connection';
import { EFConnectableSide } from '../../../f-connectors';
import { IRoundedRect } from '@foblex/2d';

export class CalculateConnectionLineByBehaviorRequest {
  static readonly fToken = Symbol('CalculateConnectionLineByBehaviorRequest');

  constructor(
    public readonly sourceRect: IRoundedRect,
    public readonly targetRect: IRoundedRect,
    public readonly connection: FConnectionBase,
    public readonly sourceConnectableSide: EFConnectableSide,
    public readonly targetConnectableSide: EFConnectableSide,
  ) {}
}
