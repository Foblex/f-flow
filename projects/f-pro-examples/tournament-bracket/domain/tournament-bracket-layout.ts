import { PointExtensions } from '@foblex/2d';
import { ITournamentBracketItem } from './i-tournament-bracket-item';

export const TOURNAMENT_NODE_WIDTH = 200;
export const TOURNAMENT_NODE_HEIGHT = 113;
export const TOURNAMENT_VERTICAL_GAP = 100;
export const TOURNAMENT_HORIZONTAL_GAP = 150;

const PHASE_COLUMNS: Record<string, number> = {
  space1: 0,
  'ub quarterfinal': 1,
  space2: 2,
  'ub semifinal': 3,
  space4: 4,
  'ub final': 5,
  'lb round 1': 0,
  'lb round 2': 1,
  'lb round 3': 2,
  'lb round 4': 3,
  'lb round 5': 4,
  'lb final': 5,
  'grand final': 6,
};

const MAXIMUM_ITEMS_IN_PHASE = 4;

export function layoutTournamentBracket(items: ITournamentBracketItem[]): ITournamentBracketItem[] {
  const positionedItems = items.map((item) => ({
    ...item,
    competitors: item.competitors.map((competitor) => ({ ...competitor })),
  }));
  const maximumItemsInColumn = _calculateMaximumItemsInColumn(positionedItems);
  const lastColumnIndex = Math.max(...Object.values(PHASE_COLUMNS));

  _setPositionToItemsInColumn(lastColumnIndex, maximumItemsInColumn, positionedItems);

  return positionedItems;
}

function _calculateMaximumItemsInColumn(items: ITournamentBracketItem[]): number {
  const result: Record<number, number> = {};

  Object.entries(PHASE_COLUMNS).forEach(([phase, columnIndex]) => {
    if (!result[columnIndex]) {
      result[columnIndex] = 0;
    }

    result[columnIndex] += items.filter(
      (item) => _normalizePhase(item.competitionPhase) === phase,
    ).length;
  });

  return Math.max(...Object.values(result));
}

function _setPositionToItemsInColumn(
  columnIndex: number,
  maximumItemsInColumn: number,
  items: ITournamentBracketItem[],
): void {
  if (columnIndex < 0) {
    return;
  }

  const height = maximumItemsInColumn * (TOURNAMENT_NODE_HEIGHT + TOURNAMENT_VERTICAL_GAP);
  const phases = _getPhasesByColumnIndex(columnIndex);
  const isSinglePhase = phases.length === 1;

  phases.forEach((phase, phaseIndex) => {
    const itemsInPhase = _getItemsInPhase(phase, items);
    const isSingleItemInPhase = itemsInPhase.length === 1;

    itemsInPhase.forEach((item, itemIndex) => {
      const xPos = columnIndex * (TOURNAMENT_NODE_WIDTH + TOURNAMENT_HORIZONTAL_GAP);
      let yPos = 0;

      if (isSinglePhase) {
        yPos = height / 2 - TOURNAMENT_NODE_HEIGHT / 2;
      } else if (isSingleItemInPhase) {
        yPos =
          height / 4 -
          TOURNAMENT_NODE_HEIGHT / 2 -
          TOURNAMENT_VERTICAL_GAP / 2 +
          (height / 2) * phaseIndex;
      } else if (itemsInPhase.length !== MAXIMUM_ITEMS_IN_PHASE) {
        yPos =
          (height / 2) * phaseIndex +
          itemIndex * 2 * (TOURNAMENT_NODE_HEIGHT + TOURNAMENT_VERTICAL_GAP) +
          TOURNAMENT_VERTICAL_GAP / 2 +
          TOURNAMENT_NODE_HEIGHT / 2;
      } else {
        yPos =
          (height / 2) * phaseIndex +
          itemIndex * (TOURNAMENT_NODE_HEIGHT + TOURNAMENT_VERTICAL_GAP);
      }

      item.position = PointExtensions.initialize(xPos, yPos);
    });
  });

  _setPositionToItemsInColumn(columnIndex - 1, maximumItemsInColumn, items);
}

function _getPhasesByColumnIndex(columnIndex: number): string[] {
  return Object.entries(PHASE_COLUMNS)
    .filter(([, currentColumnIndex]) => currentColumnIndex === columnIndex)
    .map(([phase]) => phase);
}

function _getItemsInPhase(
  phase: string,
  items: ITournamentBracketItem[],
): ITournamentBracketItem[] {
  return items.filter((item) => _normalizePhase(item.competitionPhase) === phase);
}

function _normalizePhase(phase: string): string {
  return phase.trim().toLowerCase();
}
