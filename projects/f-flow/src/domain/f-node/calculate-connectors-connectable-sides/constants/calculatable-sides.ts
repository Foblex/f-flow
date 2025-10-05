import { EFConnectableSide } from '../../../../f-connectors';

export const CALCULATABLE_SIDES = {
  [EFConnectableSide.CALCULATE]: [
    EFConnectableSide.TOP,
    EFConnectableSide.BOTTOM,
    EFConnectableSide.LEFT,
    EFConnectableSide.RIGHT,
  ],
  [EFConnectableSide.CALCULATE_HORIZONTAL]: [EFConnectableSide.LEFT, EFConnectableSide.RIGHT],
  [EFConnectableSide.CALCULATE_VERTICAL]: [EFConnectableSide.TOP, EFConnectableSide.BOTTOM],
};
