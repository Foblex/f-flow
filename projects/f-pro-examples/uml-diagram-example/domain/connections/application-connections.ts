import { EFConnectionBehavior, EFConnectionConnectableSide, EFConnectionType } from '@foblex/flow';
import { IUmlConnectionViewModel } from '../i-uml-model';

export const UML_APPLICATION_CONNECTIONS: IUmlConnectionViewModel[] = [
  {
    id: 'conn-checkout-order',
    from: 'checkout-service',
    to: 'order',
    kind: 'association',
    behavior: EFConnectionBehavior.FIXED,
    type: EFConnectionType.ADAPTIVE_CURVE,
    outputSide: EFConnectionConnectableSide.LEFT,
    inputSide: EFConnectionConnectableSide.BOTTOM,
    label: 'creates/updates',
  },
  {
    id: 'conn-projector-order',
    from: 'read-model-projector',
    to: 'order',
    kind: 'dependency',
    behavior: EFConnectionBehavior.FIXED,
    type: EFConnectionType.ADAPTIVE_CURVE,
    outputSide: EFConnectionConnectableSide.LEFT,
    inputSide: EFConnectionConnectableSide.RIGHT,
    label: 'subscribes to events',
  },
];
