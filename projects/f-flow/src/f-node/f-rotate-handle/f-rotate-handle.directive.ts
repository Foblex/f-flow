import {
  Directive, ElementRef, InjectionToken
} from "@angular/core";
import { IHasHostElement } from '../../i-has-host-element';

export const F_ROTATE_HANDLE: InjectionToken<FRotateHandleDirective> = new InjectionToken<FRotateHandleDirective>('F_ROTATE_HANDLE');

@Directive({
  selector: "[fRotateHandle]",
  host: {
    class: `f-rotate-handle f-component`,
  },
  providers: [ { provide: F_ROTATE_HANDLE, useExisting: FRotateHandleDirective } ],
})
export class FRotateHandleDirective implements IHasHostElement {

  public get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  constructor(
    private elementReference: ElementRef<HTMLElement>
  ) {
  }
}
