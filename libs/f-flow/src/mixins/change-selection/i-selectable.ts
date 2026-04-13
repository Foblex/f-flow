import { Signal } from "@angular/core";

export interface ISelectable {

  fId: Signal<string>;

  fSelectionDisabled: Signal<boolean>;

  hostElement: HTMLElement | SVGElement;

  markAsSelected(): void;

  unmarkAsSelected(): void;

  isSelected(): boolean;

  markChildrenAsSelected?(): void;

  unmarkChildrenAsSelected?(): void;
}
