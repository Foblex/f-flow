import { Injectable } from '@angular/core';
import { SizeExtensions } from '@foblex/2d';
import {
  FLayoutEngine,
  IFLayoutCalculationOptions,
  IFLayoutConnection,
  IFLayoutNode,
  IFLayoutResult,
  mergeLayoutNodes,
} from '@foblex/flow';
import { DEFAULT_TOURNAMENT_LAYOUT_ENGINE_OPTIONS } from '../configurations';
import { ETournamentLayoutAlgorithm } from '../enums';
import { ITournamentLayoutEngineOptions } from '../models';
import {
  CompactLayoutStrategy,
  ITournamentLayoutStrategy,
  MirroredLayoutStrategy,
  StandardLayoutStrategy,
} from './strategies';

@Injectable()
export class TournamentLayoutEngine extends FLayoutEngine<ITournamentLayoutEngineOptions> {
  private readonly _strategies: Record<ETournamentLayoutAlgorithm, ITournamentLayoutStrategy> = {
    [ETournamentLayoutAlgorithm.STANDARD]: new StandardLayoutStrategy(),
    [ETournamentLayoutAlgorithm.MIRRORED]: new MirroredLayoutStrategy(),
    [ETournamentLayoutAlgorithm.COMPACT]: new CompactLayoutStrategy(),
  };

  public constructor() {
    super(DEFAULT_TOURNAMENT_LAYOUT_ENGINE_OPTIONS);
  }

  protected override mergeOptions(
    currentOptions: ITournamentLayoutEngineOptions,
    nextOptions: Partial<ITournamentLayoutEngineOptions> = {},
  ): ITournamentLayoutEngineOptions {
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
      phases: nextOptions.phases ?? currentOptions.phases,
    };
  }

  public override async calculate(
    nodes: IFLayoutNode[],
    connections: IFLayoutConnection[],
    options?: IFLayoutCalculationOptions<ITournamentLayoutEngineOptions>,
  ): Promise<IFLayoutResult> {
    const layoutOptions = this.resolveLayoutOptions(options);
    const strategy = this._strategies[layoutOptions.algorithm];
    const positions = strategy.calculate(nodes, connections, layoutOptions);

    return {
      nodes: mergeLayoutNodes(nodes, positions),
    };
  }
}
