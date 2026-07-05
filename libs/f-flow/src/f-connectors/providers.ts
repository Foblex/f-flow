import { FConnectorDirective } from './f-connector';
import { FNodeInputDirective } from './f-node-input';
import { FNodeOutletDirective } from './f-node-outlet';
import { FNodeOutputDirective } from './f-node-output';

export const F_CONNECTORS_PROVIDERS = [
  FConnectorDirective,

  FNodeInputDirective,

  FNodeOutletDirective,

  FNodeOutputDirective,
];
