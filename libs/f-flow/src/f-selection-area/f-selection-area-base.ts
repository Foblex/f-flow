import { Directive, ElementRef, inject } from '@angular/core';
import { IHasHostElement } from '../i-has-host-element';
import { FTriggerEvent } from '../domain';

@Directive()
export abstract class FSelectionAreaBase implements IHasHostElement {
  public readonly hostElement = inject(ElementRef).nativeElement;

  public abstract fTrigger: (event: FTriggerEvent) => boolean;

  protected initialize(): void {
    this.hostElement.style.display = 'none';
  }
}
