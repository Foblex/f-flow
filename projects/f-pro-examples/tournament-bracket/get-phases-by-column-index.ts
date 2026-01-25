export function getPhasesByColumnIndex(columns: Record<string, number>, columnIndex: number): string[] {
  return Object.entries(columns).filter((value) => value[ 1 ] === columnIndex).map((value) => value[ 0 ]);
}
