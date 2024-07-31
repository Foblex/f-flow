import { IHeroFlowConnection } from './i-hero-flow-connection';
import { IHeroFlowNode } from './i-hero-flow-node';

export interface IHeroFlowConfiguration {

  nodes: IHeroFlowNode[];

  connections: IHeroFlowConnection[];
}
