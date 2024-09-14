export interface ICanChangeVisibility {

  hostElement: HTMLElement | SVGElement;

  show(): void;

  hide(): void;
}
