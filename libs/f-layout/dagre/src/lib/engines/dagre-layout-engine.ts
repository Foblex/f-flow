import { Injectable } from '@angular/core';
import { PointExtensions, SizeExtensions } from '@foblex/2d';
import * as dagre from 'dagre';
import { graphlib } from 'dagre';
import {
  EFLayoutDirection,
  FLayoutEngine,
  IFLayoutCalculationOptions,
  IFLayoutConnection,
  IFLayoutNode,
  IFLayoutResult,
  mergeLayoutNodes,
} from '@foblex/flow';
import { DEFAULT_DAGRE_LAYOUT_ENGINE_OPTIONS } from '../configurations';
import { EDagreLayoutAlgorithm } from '../enums';
import { IDagreLayoutEngineOptions } from '../models';

@Injectable()
export class DagreLayoutEngine extends FLayoutEngine<IDagreLayoutEngineOptions> {
  public constructor() {
    super(DEFAULT_DAGRE_LAYOUT_ENGINE_OPTIONS);
  }

  protected override mergeOptions(
    currentOptions: IDagreLayoutEngineOptions,
    nextOptions: Partial<IDagreLayoutEngineOptions> = {},
  ): IDagreLayoutEngineOptions {
    return {
      ...currentOptions,
      ...nextOptions,
      defaultNodeSize: nextOptions.defaultNodeSize
        ? SizeExtensions.initialize(
            nextOptions.defaultNodeSize.width,
            nextOptions.defaultNodeSize.height,
          )
        : SizeExtensions.initialize(
            currentOptions.defaultNodeSize.width,
            currentOptions.defaultNodeSize.height,
          ),
    };
  }

  public override async calculate(
    nodes: IFLayoutNode[],
    connections: IFLayoutConnection[],
    options?: IFLayoutCalculationOptions<IDagreLayoutEngineOptions>,
  ): Promise<IFLayoutResult> {
    const layoutOptions = this.resolveLayoutOptions(options);
    const graph = this._buildGraph(nodes, connections, layoutOptions);
    const positions = new Map<string, { x: number; y: number }>();

    dagre.layout(graph);

    graph.nodes().forEach((nodeId) => {
      const graphNode = graph.node(nodeId);
      const sourceNode = nodes.find((node) => node.id === nodeId);

      if (!graphNode || !sourceNode) {
        return;
      }

      const size = sourceNode.size ?? layoutOptions.defaultNodeSize;

      positions.set(
        nodeId,
        PointExtensions.initialize(graphNode.x - size.width / 2, graphNode.y - size.height / 2),
      );
    });

    return {
      nodes: mergeLayoutNodes(nodes, positions),
    };
  }

  private _buildGraph(
    nodes: IFLayoutNode[],
    connections: IFLayoutConnection[],
    options: IDagreLayoutEngineOptions,
  ): graphlib.Graph {
    const graph = new dagre.graphlib.Graph();

    graph.setDefaultEdgeLabel(() => ({}));
    graph.setGraph({
      rankdir: this._mapDirection(options.direction),
      nodesep: options.nodeGap,
      ranksep: options.layerGap,
      ranker: this._mapAlgorithm(options.algorithm),
    });

    nodes.forEach((node) => {
      const size = node.size ?? options.defaultNodeSize;

      graph.setNode(node.id, {
        width: size.width,
        height: size.height,
      });
    });

    connections.forEach((connection) => {
      if (!graph.hasNode(connection.source) || !graph.hasNode(connection.target)) {
        return;
      }

      graph.setEdge(connection.source, connection.target, {});
    });

    return graph;
  }

  private _mapAlgorithm(
    algorithm: EDagreLayoutAlgorithm,
  ): 'network-simplex' | 'tight-tree' | 'longest-path' {
    switch (algorithm) {
      case EDagreLayoutAlgorithm.TIGHT_TREE:
        return 'tight-tree';
      case EDagreLayoutAlgorithm.LONGEST_PATH:
        return 'longest-path';
      case EDagreLayoutAlgorithm.NETWORK_SIMPLEX:
      default:
        return 'network-simplex';
    }
  }

  private _mapDirection(direction: EFLayoutDirection): 'TB' | 'BT' | 'LR' | 'RL' {
    switch (direction) {
      case EFLayoutDirection.BOTTOM_TOP:
        return 'BT';
      case EFLayoutDirection.LEFT_RIGHT:
        return 'LR';
      case EFLayoutDirection.RIGHT_LEFT:
        return 'RL';
      case EFLayoutDirection.TOP_BOTTOM:
      default:
        return 'TB';
    }
  }
}
