import { IPoint } from '@foblex/2d';
import { IFLayoutNode } from './i-f-layout-node';
import { IFLayoutNodePosition } from './i-f-layout-node-position';

export function mergeLayoutNodes(
  nodes: IFLayoutNode[],
  positions: Map<string, IPoint>,
): IFLayoutNodePosition[] {
  return nodes.reduce<IFLayoutNodePosition[]>((result, node) => {
    const position = positions.get(node.id);

    if (!position) {
      return result;
    }

    result.push({
      id: node.id,
      position,
    });

    return result;
  }, []);
}
