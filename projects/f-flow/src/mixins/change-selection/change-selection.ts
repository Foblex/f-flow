import { AbstractConstructor, Constructor } from '../constructor';
import { IHasHostElement } from '../../i-has-host-element';
import { ICanChangeSelection } from './i-can-change-selection';

export const F_SELECTED_CLASS = 'f-selected';

type CanChangeSelectionConstructor = Constructor<ICanChangeSelection> & AbstractConstructor<ICanChangeSelection>;

export function mixinChangeSelection<T extends AbstractConstructor<IHasHostElement>>(base: T): CanChangeSelectionConstructor & T;
export function mixinChangeSelection<T extends Constructor<IHasHostElement>>(base: T): CanChangeSelectionConstructor & T {
  return class extends base {

    public fId: string = '';

    public fSelectionDisabled: boolean = false;

    public deselect(): void {
      this.deselectChild?.();
      this.hostElement.classList.remove(F_SELECTED_CLASS);
    }

    public select(): void {
      this.selectChild?.();
      if (!this.isSelected()) {
        this.hostElement.classList.add(F_SELECTED_CLASS);
      }
    }

    public isSelected(): boolean {
      return this.hostElement.classList.contains(F_SELECTED_CLASS);
    }

    public selectChild(): void {
    }

    public deselectChild(): void {
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
