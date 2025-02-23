import {
  computed,
  Directive, ElementRef, inject, InjectionToken, input
} from "@angular/core";
import { EFResizeHandleType } from './e-f-resize-handle-type';
import { IHasHostElement } from '../../i-has-host-element';
import { castToEnum } from '@foblex/utils';

export const F_RESIZE_HANDLE = new InjectionToken<FResizeHandleDirective>('F_RESIZE_HANDLE');

@Directive({
  selector: "[fResizeHandle]",
  host: {
    class: `f-resize-handle f-component`,
    '[attr.data-f-resize-handle-type]': 'type().toUpperCase()',
    '[class]': 'class()'
  },
  providers: [ { provide: F_RESIZE_HANDLE, useExisting: FResizeHandleDirective } ],
})
export class FResizeHandleDirective implements IHasHostElement {

  private readonly _elementReference = inject(ElementRef);

  public type = input.required<EFResizeHandleType, unknown>({
    alias: 'fResizeHandleType',
    transform: (x) => castToEnum(x, 'fResizeHandleType', EFResizeHandleType)
  });

  protected class = computed(() => {
    return `f-resize-handle-${ EFResizeHandleType[ this.type().toUpperCase() as keyof typeof EFResizeHandleType ] }`;
  })

  public get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }
}
