import {
  Directive, ElementRef, InjectionToken, Input
} from "@angular/core";
import { BooleanExtensions, IHasHostElement } from '@foblex/core';

export const F_ROTATE_HANDLE: InjectionToken<FRotateHandleDirective> = new InjectionToken<FRotateHandleDirective>('F_ROTATE_HANDLE');

@Directive({
  selector: "[fRotateHandle]",
  host: {
    class: `f-rotate-handle f-component`,
    '[class.f-rotate-handle-disabled]': 'disabled',
  },
  providers: [ { provide: F_ROTATE_HANDLE, useExisting: FRotateHandleDirective } ],
})
export class FRotateHandleDirective implements IHasHostElement {

  private isDisabled: boolean = false;
  @Input('fRotateHandleDisabled')
  public set disabled(isDisabled: boolean | undefined | string) {
    this.isDisabled = BooleanExtensions.castToBoolean(isDisabled);
  }
  public get disabled(): boolean {
    return this.isDisabled;
  }

  public get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  constructor(
    private elementReference: ElementRef<HTMLElement>
  ) {
  }
}
