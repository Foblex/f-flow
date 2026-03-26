import { IRoundedRect } from '@foblex/2d';
import { EFConnectableSide } from '../../enums';
import { FConnectionComponentsParent } from '../../models';
import { FConnectorBase } from '../../../f-connectors';

export class ConnectionBehaviourBuilderRequest {
  constructor(
    public readonly sourceRect: IRoundedRect,
    public readonly targetRect: IRoundedRect,
    public readonly connection: FConnectionComponentsParent,
    public readonly sourceConnectableSide: EFConnectableSide,
    public readonly targetConnectableSide: EFConnectableSide,
    public readonly sourceConnector?: FConnectorBase,
    public readonly targetConnector?: FConnectorBase,
  ) {}
}
