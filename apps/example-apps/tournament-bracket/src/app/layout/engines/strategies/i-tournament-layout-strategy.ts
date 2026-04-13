import { IPoint } from '@foblex/2d';
import { IFLayoutConnection, IFLayoutNode } from '@foblex/flow';
import { ITournamentLayoutEngineOptions } from '../../models';

export interface ITournamentLayoutStrategy {
  calculate(
    nodes: IFLayoutNode[],
    connections: IFLayoutConnection[],
    options: ITournamentLayoutEngineOptions,
  ): Map<string, IPoint>;
}
