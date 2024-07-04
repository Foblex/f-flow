import { IHasHostElement, AbstractConstructor, Constructor } from '@foblex/core';

export interface ICanChangeConnectionVisibility {

  hostElement: HTMLElement | SVGElement;

  show(): void;

  hide(): void;
}

type CanChangeConnectionVisibilityConstructor = Constructor<ICanChangeConnectionVisibility> & AbstractConstructor<ICanChangeConnectionVisibility>;

export function mixinChangeConnectionVisibility<T extends AbstractConstructor<IHasHostElement>>(base: T): CanChangeConnectionVisibilityConstructor & T;
export function mixinChangeConnectionVisibility<T extends Constructor<IHasHostElement>>(base: T): CanChangeConnectionVisibilityConstructor & T {
  return class extends base {

    public show(): void {
      this.hostElement.style.display = "unset";
    }

    public hide(): void {
      this.hostElement.style.display = "none";
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
