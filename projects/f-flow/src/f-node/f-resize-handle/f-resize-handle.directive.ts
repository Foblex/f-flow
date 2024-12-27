import {
  Directive, ElementRef, HostBinding, inject, InjectionToken, Input
} from "@angular/core";
import { EFResizeHandleType } from './e-f-resize-handle-type';
import { IHasHostElement } from '../../i-has-host-element';
import { castToEnum } from '@foblex/utils';

export const F_RESIZE_HANDLE = new InjectionToken<FResizeHandleDirective>('F_RESIZE_HANDLE');

@Directive({
  selector: "[fResizeHandle]",
  host: {
    class: `f-resize-handle f-component`,
    '[attr.data-f-resize-handle-type]': 'type',
  },
  providers: [ { provide: F_RESIZE_HANDLE, useExisting: FResizeHandleDirective } ],
})
export class FResizeHandleDirective implements IHasHostElement {

  private _elementReference = inject(ElementRef);

  @Input({
    alias: 'fResizeHandleType',
    transform: (x: unknown) => castToEnum(x, 'fResizeHandleType', EFResizeHandleType)
  })
  public type: EFResizeHandleType = EFResizeHandleType.LEFT_TOP;

  @HostBinding('class')
  public get typeClass(): string {
    return `f-resize-handle-${ EFResizeHandleType[ this.type.toUpperCase() as keyof typeof EFResizeHandleType ] }`;
  }

  public get hostElement(): HTMLElement {
    return this._elementReference.nativeElement;
  }
}
