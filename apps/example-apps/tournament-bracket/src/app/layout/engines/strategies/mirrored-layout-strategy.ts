import { IPoint, PointExtensions } from '@foblex/2d';
import { IFLayoutConnection, IFLayoutNode } from '@foblex/flow';
import { ITournamentLayoutEngineOptions, TTournamentBracketType } from '../../models';
import { ITournamentLayoutStrategy } from './i-tournament-layout-strategy';

export class MirroredLayoutStrategy implements ITournamentLayoutStrategy {
  public calculate(
    nodes: IFLayoutNode[],
    connections: IFLayoutConnection[],
    options: ITournamentLayoutEngineOptions,
  ): Map<string, IPoint> {
    const positions = new Map<string, IPoint>();
    const { nodeGap, layerGap, defaultNodeSize, phases } = options;
    const nodeWidth = defaultNodeSize.width;
    const nodeHeight = defaultNodeSize.height;

    const childrenOf = this._buildChildrenMap(connections);

    const upperNodes = this._getNodesByBracket(nodes, phases, 'upper');
    const lowerNodes = this._getNodesByBracket(nodes, phases, 'lower');
    const finalNodes = this._getNodesByBracket(nodes, phases, 'final');

    const upperMaxRound = this._getMaxRoundInBracket(upperNodes, phases);
    const lowerMaxRound = this._getMaxRoundInBracket(lowerNodes, phases);
    const hasBracketRounds = upperNodes.length > 0 || lowerNodes.length > 0;
    const totalColumns = hasBracketRounds ? Math.max(upperMaxRound, lowerMaxRound) + 2 : 1;

    this._positionBracketReversed(
      upperNodes,
      childrenOf,
      phases,
      0,
      positions,
      nodeWidth,
      nodeHeight,
      nodeGap,
      layerGap,
      totalColumns,
    );

    const upperBottom = this._getBracketBottom(upperNodes, positions, nodeHeight);
    const separation = upperNodes.length > 0 ? nodeGap * 3 : 0;

    this._positionBracketReversed(
      lowerNodes,
      childrenOf,
      phases,
      upperBottom + separation,
      positions,
      nodeWidth,
      nodeHeight,
      nodeGap,
      layerGap,
      totalColumns,
    );

    const upperCenter = this._getBracketCenter(upperNodes, positions, nodeHeight);
    const lowerCenter = this._getBracketCenter(lowerNodes, positions, nodeHeight);

    finalNodes.forEach((node) => {
      const x = hasBracketRounds ? (totalColumns - 1) * (nodeWidth + layerGap) : 0;
      const y = this._getFinalNodeY(upperCenter, lowerCenter, nodeHeight);

      positions.set(node.id, PointExtensions.initialize(x, y));
    });

    return positions;
  }

  private _buildChildrenMap(connections: IFLayoutConnection[]): Map<string, string[]> {
    const children = new Map<string, string[]>();

    connections.forEach((conn) => {
      const list = children.get(conn.target) ?? [];
      list.push(conn.source);
      children.set(conn.target, list);
    });

    return children;
  }

  private _positionBracketReversed(
    bracketNodes: IFLayoutNode[],
    childrenOf: Map<string, string[]>,
    phases: Record<string, { bracket: TTournamentBracketType; roundIndex: number }>,
    yOffset: number,
    positions: Map<string, IPoint>,
    nodeWidth: number,
    nodeHeight: number,
    nodeGap: number,
    layerGap: number,
    totalColumns: number,
  ): void {
    if (bracketNodes.length === 0) {
      return;
    }

    const rounds = this._groupByRound(bracketNodes, phases);
    const maxRound = Math.max(...Array.from(rounds.keys()));
    const sortedRoundKeys = Array.from(rounds.keys()).sort((a, b) => a - b);
    const firstRound = sortedRoundKeys[0];
    const leafNodes = rounds.get(firstRound) ?? [];

    leafNodes.forEach((node, index) => {
      const reversedColumn = totalColumns - 2 - (maxRound - (phases[node.id]?.roundIndex ?? 0));
      const x = reversedColumn * (nodeWidth + layerGap);
      const y = yOffset + index * (nodeHeight + nodeGap);
      positions.set(node.id, PointExtensions.initialize(x, y));
    });

    for (let i = 1; i < sortedRoundKeys.length; i++) {
      const roundIndex = sortedRoundKeys[i];
      const nodesInRound = rounds.get(roundIndex) ?? [];

      nodesInRound.forEach((node) => {
        const children = (childrenOf.get(node.id) ?? []).filter((childId) =>
          positions.has(childId),
        );
        const reversedColumn = totalColumns - 2 - (maxRound - (phases[node.id]?.roundIndex ?? 0));
        const x = reversedColumn * (nodeWidth + layerGap);

        if (children.length > 0) {
          const childCenters = children.flatMap((childId) => {
            const position = positions.get(childId);

            return position ? [position.y + nodeHeight / 2] : [];
          });

          const avgCenter = childCenters.reduce((sum, c) => sum + c, 0) / childCenters.length;
          positions.set(node.id, PointExtensions.initialize(x, avgCenter - nodeHeight / 2));
        } else {
          positions.set(node.id, PointExtensions.initialize(x, yOffset));
        }
      });
    }
  }

  private _getNodesByBracket(
    nodes: IFLayoutNode[],
    phases: Record<string, { bracket: TTournamentBracketType; roundIndex: number }>,
    bracket: TTournamentBracketType,
  ): IFLayoutNode[] {
    return nodes.filter((node) => phases[node.id]?.bracket === bracket);
  }

  private _groupByRound(
    nodes: IFLayoutNode[],
    phases: Record<string, { bracket: TTournamentBracketType; roundIndex: number }>,
  ): Map<number, IFLayoutNode[]> {
    const rounds = new Map<number, IFLayoutNode[]>();

    nodes.forEach((node) => {
      const round = phases[node.id]?.roundIndex ?? 0;
      const group = rounds.get(round) ?? [];
      group.push(node);
      rounds.set(round, group);
    });

    return rounds;
  }

  private _getMaxRoundInBracket(
    bracketNodes: IFLayoutNode[],
    phases: Record<string, { bracket: TTournamentBracketType; roundIndex: number }>,
  ): number {
    let max = 0;

    bracketNodes.forEach((node) => {
      max = Math.max(max, phases[node.id]?.roundIndex ?? 0);
    });

    return max;
  }

  private _getBracketBottom(
    bracketNodes: IFLayoutNode[],
    positions: Map<string, IPoint>,
    nodeHeight: number,
  ): number {
    let maxBottom = 0;

    bracketNodes.forEach((node) => {
      const pos = positions.get(node.id);

      if (pos) {
        maxBottom = Math.max(maxBottom, pos.y + nodeHeight);
      }
    });

    return maxBottom;
  }

  private _getBracketCenter(
    bracketNodes: IFLayoutNode[],
    positions: Map<string, IPoint>,
    nodeHeight: number,
  ): number | null {
    if (bracketNodes.length === 0) {
      return null;
    }

    let minY = Infinity;
    let maxY = -Infinity;

    bracketNodes.forEach((node) => {
      const pos = positions.get(node.id);

      if (pos) {
        minY = Math.min(minY, pos.y);
        maxY = Math.max(maxY, pos.y + nodeHeight);
      }
    });

    if (minY === Infinity) {
      return null;
    }

    return (minY + maxY) / 2;
  }

  private _getFinalNodeY(
    upperCenter: number | null,
    lowerCenter: number | null,
    nodeHeight: number,
  ): number {
    if (upperCenter !== null && lowerCenter !== null) {
      return (upperCenter + lowerCenter) / 2 - nodeHeight / 2;
    }

    if (upperCenter !== null) {
      return upperCenter - nodeHeight / 2;
    }

    if (lowerCenter !== null) {
      return lowerCenter - nodeHeight / 2;
    }

    return 0;
  }
}
