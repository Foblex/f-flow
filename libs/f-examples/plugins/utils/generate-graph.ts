import { IPoint, ISize, PointExtensions, SizeExtensions } from '@foblex/2d';
import { IFLayoutConnection, IFLayoutNode } from '@foblex/flow';

export const DEFAULT_NODE_SIZE = SizeExtensions.initialize(120, 72);

let graphId = 0;

export interface INode extends IFLayoutNode {
  label: string;
  position?: IPoint;
}

export interface IConnection extends IFLayoutConnection {
  id: string;
}

export interface IGraph {
  nodes: INode[];
  connections: IConnection[];
}

export function generateGraph(nodeCount: number, nodeSize?: ISize): IGraph {
  graphId++;
  const maxLevel = getTreeLevel(nodeCount);
  const nodes = Array.from({ length: nodeCount }, (_, index) => {
    const nodeNumber = index + 1;
    const nodeId = getNodeId(nodeNumber, graphId);

    return {
      id: nodeId,
      label: getNodeLabel(nodeNumber),
      position: createDefaultNodePosition(nodeNumber, nodeSize, maxLevel),
      size: nodeSize,
    };
  });
  const connections = nodes.slice(1).map((node, index) => {
    const parentId = getNodeId(Math.floor((index + 2) / 2), graphId);

    return {
      id: `${parentId}->${node.id}`,
      source: parentId,
      target: node.id,
    };
  });

  return { nodes, connections };
}

function getNodeId(index: number, graphId: number): string {
  return `${graphId}-node-${index}`;
}

function getNodeLabel(index: number): string {
  return `Node${index}`;
}

function createDefaultNodePosition(
  nodeNumber: number,
  nodeSize: ISize = DEFAULT_NODE_SIZE,
  maxLevel: number,
): IPoint {
  const level = getTreeLevel(nodeNumber);
  const indexInLevel = getIndexInLevel(nodeNumber, level);
  const slotSize = getHorizontalSlotSize(nodeSize);
  const levelSpan = 2 ** (maxLevel - level);
  const center = (indexInLevel + 0.5) * levelSpan * slotSize;
  const x = center - nodeSize.width / 2;
  const y = level * getVerticalSlotSize(nodeSize);

  return PointExtensions.initialize(x, y);
}

function getTreeLevel(nodeNumber: number): number {
  return Math.max(0, Math.floor(Math.log2(Math.max(1, nodeNumber))));
}

function getIndexInLevel(nodeNumber: number, level: number): number {
  return nodeNumber - 2 ** level;
}

function getHorizontalSlotSize(nodeSize: ISize): number {
  return nodeSize.width + DEFAULT_HORIZONTAL_GAP;
}

function getVerticalSlotSize(nodeSize: ISize): number {
  return nodeSize.height + DEFAULT_VERTICAL_GAP;
}

const DEFAULT_HORIZONTAL_GAP = 96;
const DEFAULT_VERTICAL_GAP = 120;
