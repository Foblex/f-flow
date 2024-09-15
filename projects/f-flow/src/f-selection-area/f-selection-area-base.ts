import { IRect } from '@foblex/2d';
import { Directive } from '@angular/core';
import { IHasHostElement } from '../i-has-host-element';

@Directive()
export abstract class FSelectionAreaBase implements IHasHostElement {

  public abstract hostElement: HTMLElement | SVGElement;

  public abstract hide(): void;

  public abstract show(): void;

  public abstract draw(object: IRect): void;
}
