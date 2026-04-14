import { ICanChangeVisibility } from './i-can-change-visibility';
import { IHasHostElement } from '../../i-has-host-element';
import { AbstractConstructor, Constructor } from '../constructor';

type CanChangeVisibilityConstructor = Constructor<ICanChangeVisibility> &
  AbstractConstructor<ICanChangeVisibility>;

export function mixinChangeVisibility<T extends AbstractConstructor<IHasHostElement>>(
  base: T,
): CanChangeVisibilityConstructor & T;
export function mixinChangeVisibility<T extends Constructor<IHasHostElement>>(
  base: T,
): CanChangeVisibilityConstructor & T {
  return class extends base {
    public show(): void {
      this.hostElement.style.display = 'unset';
    }

    public hide(): void {
      this.hostElement.style.display = 'none';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }
  };
}
