import { EFConnectableSide, FConnectorBase } from '../../../../f-connectors';

export type TCalculateMode =
  | EFConnectableSide.CALCULATE
  | EFConnectableSide.CALCULATE_HORIZONTAL
  | EFConnectableSide.CALCULATE_VERTICAL;

export const CALCULATE_MODES = [
  EFConnectableSide.CALCULATE,
  EFConnectableSide.CALCULATE_HORIZONTAL,
  EFConnectableSide.CALCULATE_VERTICAL,
];

export class CalculateConnectableSideByConnectedPositionsRequest {
  static readonly fToken = Symbol('CalculateConnectableSideByConnectedPositionsRequest');
  constructor(
    public readonly connector: FConnectorBase,
    public readonly mode: TCalculateMode,
  ) {}
}
