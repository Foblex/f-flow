import { EFConnectableSide } from '../../../../f-connection-v2';

/**
 * Checks if the given side is one of the calculate modes.
 * @param side The connectable side to check.
 * @returns True if the side is a calculate mode, false otherwise.
 */
export function isCalculateMode(side: EFConnectableSide): boolean {
  return (
    side === EFConnectableSide.CALCULATE ||
    side === EFConnectableSide.CALCULATE_HORIZONTAL ||
    side === EFConnectableSide.CALCULATE_VERTICAL
  );
}
