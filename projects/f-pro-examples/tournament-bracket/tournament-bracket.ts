import { ITournamentBracketItem } from './i-tournament-bracket-item';
import { IMap } from '@foblex/flow';
import { getPhasesByColumnIndex } from './get-phases-by-column-index';
import { getItemsInPhase } from './get-items-in-phase';
import { PointExtensions } from '@foblex/2d';
import { calculateMaximumItemsInColumn } from './calculate-maximum-items-in-column';

export class TournamentBracket {

  constructor(
    private items: ITournamentBracketItem[],
    private nodeWidth: number,
    private nodeHeight: number,
    private verticalGap: number,
    private horizontalGap: number
  ) {
  }

  public calculate(): ITournamentBracketItem[] {
    const columnIndex = this.getLastColumnIndex();

    const maximumItemsInColumn = calculateMaximumItemsInColumn(BRACKET_COLUMNS, this.items);
    this.setPositionToItemsInColumn(columnIndex, maximumItemsInColumn);

    return this.items;
  }

  private getLastColumnIndex(): number {
    return Math.max(...Object.values(BRACKET_COLUMNS));
  }

  private setPositionToItemsInColumn(columnIndex: number, maximumItemsInColumn: number): void {
    if (columnIndex < 0) {
      return;
    }
    const height = maximumItemsInColumn * (this.nodeHeight + this.verticalGap);
    const maximumItemsInPhase = 4;

    const phases = getPhasesByColumnIndex(BRACKET_COLUMNS, columnIndex);

    const isSinglePhase = phases.length === 1;

    phases.forEach((phase: string, phaseIndex: number) => {
      const itemsInPhase = getItemsInPhase(phase, this.items);

      const isSingleItemInPhase = itemsInPhase.length === 1;

      itemsInPhase.forEach((item: ITournamentBracketItem, itemIndex: number) => {
        const xPos = columnIndex * (this.nodeWidth + this.horizontalGap);
        let yPos = 0;
        if (isSinglePhase) {
          yPos = height / 2 - this.nodeHeight / 2;
        } else {
          if (isSingleItemInPhase) {
            yPos = height / 4 - this.nodeHeight / 2 - this.verticalGap / 2 + (height / 2) * phaseIndex;
          } else {
            if (itemsInPhase.length !== maximumItemsInPhase) {
              yPos = (height / 2) * phaseIndex + (itemIndex) * 2 * (this.nodeHeight + this.verticalGap) + this.verticalGap / 2 + this.nodeHeight / 2;
            } else {
              yPos = (height / 2) * phaseIndex + (itemIndex) * (this.nodeHeight + this.verticalGap);
            }
          }
        }

        item.position = PointExtensions.initialize(xPos, yPos);
      });
    });

    this.setPositionToItemsInColumn(columnIndex - 1, maximumItemsInColumn);
  }
}

export const BRACKET_COLUMNS: IMap<number> = {
  [ 'space1' ]: 0,
  [ 'UB Quarterfinal'.toLowerCase() ]: 1,
  [ 'space2' ]: 2,
  [ 'UB Semifinal'.toLowerCase() ]: 3,
  [ 'space4' ]: 4,
  [ 'UB Final'.toLowerCase() ]: 5,

  [ 'LB Round 1'.toLowerCase() ]: 0,
  [ 'LB Round 2'.toLowerCase() ]: 1,
  [ 'LB Round 3'.toLowerCase() ]: 2,
  [ 'LB Round 4'.toLowerCase() ]: 3,
  [ 'LB Round 5'.toLowerCase() ]: 4,
  [ 'LB Final'.toLowerCase() ]: 5,

  [ 'Grand Final'.toLowerCase() ]: 6,
};
