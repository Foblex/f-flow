import { IHasHostElement } from '@foblex/core';
import { Directive, InjectionToken } from '@angular/core';
import { ISelectionAreaRect } from './domain';

export const F_SELECTION_AREA = new InjectionToken<FSelectionAreaBase>('F_SELECTION_AREA');

@Directive()
export abstract class FSelectionAreaBase implements IHasHostElement {

  public abstract hostElement: HTMLElement | SVGElement;

  public abstract hide(): void;

  public abstract show(): void;

  public abstract draw(object: ISelectionAreaRect): void;
}
