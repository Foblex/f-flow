import { IFLayoutResult } from '@foblex/flow';
import { IGraph } from './generate-graph';

export function applyLayout(graph: IGraph, layout: IFLayoutResult): IGraph {
  return {
    nodes: graph.nodes.map((node, index) => {
      return {
        ...node,
        ...(layout.nodes[index] ?? {}),
      };
    }),
    connections: graph.connections,
  };
}
