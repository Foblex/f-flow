import { Injectable } from '@angular/core';
import { IPoint, PointExtensions, SizeExtensions } from '@foblex/2d';
import {
  EFLayoutDirection,
  FLayoutEngine,
  IFLayoutCalculationOptions,
  IFLayoutConnection,
  IFLayoutNode,
  IFLayoutResult,
  mergeLayoutNodes,
} from '@foblex/flow';
import { DEFAULT_ELK_LAYOUT_ENGINE_OPTIONS } from '../configurations';
import { EElkLayoutAlgorithm } from '../enums';
import {
  IElkLayoutEdge,
  IElkLayoutEngineOptions,
  IElkLayoutModule,
  IElkLayoutNode,
  IElkLayoutResponse,
} from '../models';

@Injectable()
export class ElkLayoutEngine extends FLayoutEngine<IElkLayoutEngineOptions> {
  private _elkCtor?: Promise<IElkLayoutModule>;

  public constructor() {
    super(DEFAULT_ELK_LAYOUT_ENGINE_OPTIONS);
  }

  protected override mergeOptions(
    currentOptions: IElkLayoutEngineOptions,
    nextOptions: Partial<IElkLayoutEngineOptions> = {},
  ): IElkLayoutEngineOptions {
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
      layoutOptions: {
        ...(currentOptions.layoutOptions || {}),
        ...(nextOptions.layoutOptions || {}),
      },
    };
  }

  public override async calculate(
    nodes: IFLayoutNode[],
    connections: IFLayoutConnection[],
    options?: IFLayoutCalculationOptions<IElkLayoutEngineOptions>,
  ): Promise<IFLayoutResult> {
    const layoutOptions = this.resolveLayoutOptions(options);
    const elkModule = await this._loadElk();
    const layout = (await new elkModule.default().layout(
      this._buildLayoutConfiguration(nodes, connections, layoutOptions),
    )) as IElkLayoutResponse;
    const positions = new Map<string, IPoint>();

    layout.children?.forEach((node) => {
      positions.set(node.id, PointExtensions.initialize(node.x, node.y));
    });

    return {
      nodes: mergeLayoutNodes(nodes, positions),
    };
  }

  private _buildLayoutConfiguration(
    nodes: IFLayoutNode[],
    connections: IFLayoutConnection[],
    options: IElkLayoutEngineOptions,
  ): {
    id: string;
    layoutOptions: Record<string, string>;
    children: IElkLayoutNode[];
    edges: IElkLayoutEdge[];
  } {
    const layoutOptions: Record<string, string> = {
      'elk.algorithm': this._mapAlgorithm(options.algorithm),
      'elk.direction': this._mapDirection(options.direction),
      'spacing.nodeNode': `${options.nodeGap}`,
      'spacing.nodeNodeBetweenLayers': `${options.layerGap}`,
      ...(options.layoutOptions || {}),
    };
    const graphNodes = nodes.map((node) => this._buildGraphNode(node, options.defaultNodeSize));
    const graphEdges = connections.reduce<IElkLayoutEdge[]>((result, connection, index) => {
      if (!graphNodes.some((node) => node.id === connection.source)) {
        return result;
      }

      if (!graphNodes.some((node) => node.id === connection.target)) {
        return result;
      }

      result.push({
        id: this._createEdgeId(connection, index),
        sources: [connection.source],
        targets: [connection.target],
      });

      return result;
    }, []);

    return {
      id: 'root',
      layoutOptions,
      children: graphNodes,
      edges: graphEdges,
    };
  }

  private _buildGraphNode(
    node: IFLayoutNode,
    defaultNodeSize: { width: number; height: number },
  ): IElkLayoutNode {
    const size = node.size ?? defaultNodeSize;
    const graphNode: IElkLayoutNode = {
      id: node.id,
      width: size.width,
      height: size.height,
    };
    const position = this._getNodePosition(node);

    if (!position) {
      return graphNode;
    }

    return {
      ...graphNode,
      x: position.x,
      y: position.y,
    };
  }

  private _loadElk(): Promise<IElkLayoutModule> {
    if (!this._elkCtor) {
      this._elkCtor = import('elkjs/lib/elk.bundled');
    }

    return this._elkCtor;
  }

  private _getNodePosition(node: IFLayoutNode): IPoint | null {
    const positionedNode = node as IFLayoutNode & { position?: IPoint };

    if (!positionedNode.position) {
      return null;
    }

    return positionedNode.position;
  }

  private _mapAlgorithm(algorithm: EElkLayoutAlgorithm): string {
    switch (algorithm) {
      case EElkLayoutAlgorithm.FIXED:
        return 'fixed';
      case EElkLayoutAlgorithm.BOX:
        return 'box';
      case EElkLayoutAlgorithm.RANDOM:
        return 'random';
      case EElkLayoutAlgorithm.LAYERED:
        return 'layered';
      case EElkLayoutAlgorithm.STRESS:
        return 'stress';
      case EElkLayoutAlgorithm.MRTREE:
        return 'mrtree';
      case EElkLayoutAlgorithm.RADIAL:
        return 'radial';
      case EElkLayoutAlgorithm.FORCE:
        return 'force';
      case EElkLayoutAlgorithm.DISCO:
        return 'disco';
      case EElkLayoutAlgorithm.SPORE_OVERLAP:
        return 'sporeOverlap';
      case EElkLayoutAlgorithm.SPORE_COMPACTION:
        return 'sporeCompaction';
      case EElkLayoutAlgorithm.RECT_PACKING:
        return 'rectpacking';
      default:
        return 'layered';
    }
  }

  private _createEdgeId(connection: IFLayoutConnection, index: number): string {
    return `${connection.source}->${connection.target}-${index}`;
  }

  private _mapDirection(direction: EFLayoutDirection): 'DOWN' | 'UP' | 'RIGHT' | 'LEFT' {
    switch (direction) {
      case EFLayoutDirection.BOTTOM_TOP:
        return 'UP';
      case EFLayoutDirection.LEFT_RIGHT:
        return 'RIGHT';
      case EFLayoutDirection.RIGHT_LEFT:
        return 'LEFT';
      case EFLayoutDirection.TOP_BOTTOM:
      default:
        return 'DOWN';
    }
  }
}
