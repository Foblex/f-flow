export interface ICanChangeSelection {

  fId: string;

  fSelectionDisabled: boolean;

  hostElement: HTMLElement | SVGElement;

  select(): void;

  deselect(): void;

  isSelected(): boolean;

  selectChild?(): void;

  deselectChild?(): void;
}
