import {
  Directive, ElementRef, Inject, InjectionToken, Input, OnDestroy, Optional, SkipSelf
} from "@angular/core";
import { Subject } from 'rxjs';
import { BooleanExtensions, IHasHostElement } from '@foblex/core';
import { F_NODE } from '../f-node-base';
import { IHasStateChanges } from '../../i-has-state-changes';

export const F_DRAG_HANDLE: InjectionToken<FDragHandleDirective> = new InjectionToken<FDragHandleDirective>('F_DRAG_HANDLE');

@Directive({
  selector: "[fDragHandle]",
  host: {
    class: "f-drag-handle f-component",
    '[class.f-drag-handle-disabled]': 'disabled'
  },
  providers: [ { provide: F_DRAG_HANDLE, useExisting: FDragHandleDirective } ],
})
export class FDragHandleDirective implements IHasHostElement {

  @Input('fDragHandleDisabled')
  public get disabled(): boolean {
    return this.isDisabled;
  }

  public set disabled(isDisabled: boolean | undefined | string) {
    this.isDisabled = BooleanExtensions.castToBoolean(isDisabled);
  }

  private isDisabled: boolean = false;

  public get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  constructor(
    private elementReference: ElementRef<HTMLElement>
  ) {
  }
}
