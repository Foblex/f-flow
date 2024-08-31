import { IHasHostElement, IRect } from '@foblex/core';
import { Directive } from '@angular/core';

@Directive()
export abstract class FSelectionAreaBase implements IHasHostElement {

  public abstract hostElement: HTMLElement | SVGElement;

  public abstract hide(): void;

  public abstract show(): void;

  public abstract draw(object: IRect): void;
}
