import { IFLayoutConnection } from './i-f-layout-connection';
import { IFLayoutNode } from './i-f-layout-node';

export interface IFLayoutGraph<
  TNode extends IFLayoutNode = IFLayoutNode,
  TConnection extends IFLayoutConnection = IFLayoutConnection,
> {
  nodes: TNode[];
  connections: TConnection[];
}
