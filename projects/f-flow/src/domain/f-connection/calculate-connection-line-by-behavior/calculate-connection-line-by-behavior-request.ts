import { EFConnectionBehavior } from '../../../f-connection';
import { EFConnectableSide } from '../../../f-connectors';
import { IRoundedRect } from '@foblex/2d';

export class CalculateConnectionLineByBehaviorRequest {
  static readonly fToken = Symbol('CalculateConnectionLineByBehaviorRequest');

  constructor(
    public sourceRect: IRoundedRect,
    public targetRect: IRoundedRect,
    public behavior: EFConnectionBehavior | string,
    public sourceConnectableSide: EFConnectableSide,
    public targetConnectableSide: EFConnectableSide,
  ) {}
}
