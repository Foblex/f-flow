import { IHasHostElement, AbstractConstructor, Constructor  } from '@foblex/core';
import { IConnectionPath } from '../f-path';

export interface ISelectable {

  fSelectionDisabled: boolean;

  hostElement: HTMLElement | SVGElement;

  select(): void;

  deselect(): void;

  isSelected(): boolean;
}

export const F_SELECTED_CLASS = 'f-selected';

type CanChangeConnectionSelectionConstructor = Constructor<ISelectable> & AbstractConstructor<ISelectable>;

export function mixinChangeConnectionSelection<T extends AbstractConstructor<IHasHostElement>>(base: T): CanChangeConnectionSelectionConstructor & T;
export function mixinChangeConnectionSelection<T extends Constructor<IHasHostElement>>(base: T): CanChangeConnectionSelectionConstructor & T {
  return class extends base {

    public fSelectionDisabled: boolean = false;

    public fPath: IConnectionPath | undefined;

    public deselect(): void {
      this.fPath?.deselect();
      this.hostElement.classList.remove(F_SELECTED_CLASS);
    }

    public select(): void {
      this.fPath?.select();
      if(!this.hostElement.classList.contains(F_SELECTED_CLASS)) {
        this.hostElement.classList.add(F_SELECTED_CLASS);
      }
    }

    public isSelected(): boolean {
      return this.hostElement.classList.contains(F_SELECTED_CLASS);
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
