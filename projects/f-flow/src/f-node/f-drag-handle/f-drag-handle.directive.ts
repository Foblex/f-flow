import {
  Directive, ElementRef, InjectionToken
} from "@angular/core";
import { IHasHostElement } from '../../i-has-host-element';

export const F_DRAG_HANDLE: InjectionToken<FDragHandleDirective> = new InjectionToken<FDragHandleDirective>('F_DRAG_HANDLE');

@Directive({
  selector: "[fDragHandle]",
  host: {
    class: "f-drag-handle f-component"
  },
  providers: [ { provide: F_DRAG_HANDLE, useExisting: FDragHandleDirective } ],
})
export class FDragHandleDirective implements IHasHostElement {

  public get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  constructor(
    private elementReference: ElementRef<HTMLElement>
  ) {
  }
}
