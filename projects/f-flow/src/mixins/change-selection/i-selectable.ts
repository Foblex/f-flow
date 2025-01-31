export interface ISelectable {

  fId: string;

  fSelectionDisabled: boolean;

  hostElement: HTMLElement | SVGElement;

  markAsSelected(): void;

  unmarkAsSelected(): void;

  isSelected(): boolean;

  markChildrenAsSelected?(): void;

  unmarkChildrenAsSelected?(): void;
}
