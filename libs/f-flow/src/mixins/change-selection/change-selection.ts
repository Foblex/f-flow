import { AbstractConstructor, Constructor } from '../constructor';
import { IHasHostElement } from '../../i-has-host-element';
import { ISelectable } from './i-selectable';
import { signal } from '@angular/core';

export const F_SELECTED_CLASS = 'f-selected';

type CanChangeSelectionConstructor = Constructor<ISelectable> & AbstractConstructor<ISelectable>;

export function mixinChangeSelection<T extends AbstractConstructor<IHasHostElement>>(
  base: T,
): CanChangeSelectionConstructor & T;
export function mixinChangeSelection<T extends Constructor<IHasHostElement>>(
  base: T,
): CanChangeSelectionConstructor & T {
  return class extends base {
    public fId = signal('');
    public fSelectionDisabled = signal(false);

    public unmarkAsSelected(): void {
      this.unmarkChildrenAsSelected?.();
      this.hostElement.classList.remove(F_SELECTED_CLASS);
    }

    public markAsSelected(): void {
      this.markChildrenAsSelected?.();
      if (!this.isSelected()) {
        this.hostElement.classList.add(F_SELECTED_CLASS);
      }
    }

    public isSelected(): boolean {
      return this.hostElement.classList.contains(F_SELECTED_CLASS);
    }

    public markChildrenAsSelected(): void {}

    public unmarkChildrenAsSelected(): void {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }
  };
}
