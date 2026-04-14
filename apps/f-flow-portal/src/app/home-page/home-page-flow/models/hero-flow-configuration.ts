import { HeroConnection } from './hero-connection';
import { HeroNode } from './hero-node';

export interface HeroFlowConfiguration {
  nodes: HeroNode[];
  connections: HeroConnection[];
}
