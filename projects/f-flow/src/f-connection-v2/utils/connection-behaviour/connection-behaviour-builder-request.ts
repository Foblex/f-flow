import { IRoundedRect } from '@foblex/2d';
import { EFConnectableSide } from '../../enums';
import { FConnectionComponentsParent } from '../../models';
import { IConnectionEndpointRotationContext } from './models';

export class ConnectionBehaviourBuilderRequest {
  constructor(
    public readonly sourceRect: IRoundedRect,
    public readonly targetRect: IRoundedRect,
    public readonly connection: FConnectionComponentsParent,
    public readonly sourceConnectableSide: EFConnectableSide,
    public readonly targetConnectableSide: EFConnectableSide,
    public readonly sourceRotationContext?: IConnectionEndpointRotationContext,
    public readonly targetRotationContext?: IConnectionEndpointRotationContext,
  ) {}
}
