import { ServiceNode } from './service-node';
import { ServiceConnection } from './service-connection';

export interface ServicesFlowConfiguration {
  nodes: ServiceNode[];
  connections: ServiceConnection[];
}
