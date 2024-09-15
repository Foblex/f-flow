import {
  Directive, ElementRef, HostBinding, InjectionToken, Input
} from "@angular/core";
import { EFResizeHandleType } from './e-f-resize-handle-type';
import { IHasHostElement } from '../../i-has-host-element';
import { castToEnum } from '@foblex/utils';

export const F_RESIZE_HANDLE: InjectionToken<FResizeHandleDirective> = new InjectionToken<FResizeHandleDirective>('F_RESIZE_HANDLE');

@Directive({
  selector: "[fResizeHandle]",
  host: {
    class: `f-resize-handle f-component`,
    '[attr.data-f-resize-handle-type]': 'type',
  },
  providers: [ { provide: F_RESIZE_HANDLE, useExisting: FResizeHandleDirective } ],
})
export class FResizeHandleDirective implements IHasHostElement {

  public _type: EFResizeHandleType = EFResizeHandleType.LEFT_TOP;
  @Input('fResizeHandleType')
  public set type(type: EFResizeHandleType) {
    this._type = castToEnum(type, 'fResizeHandleType', EFResizeHandleType);
  }
  public get type(): EFResizeHandleType {
    return this._type;
  }

  @HostBinding('class')
  public get typeClass(): string {
    return `f-resize-handle-${ EFResizeHandleType[ this.type.toUpperCase() as keyof typeof EFResizeHandleType ] }`;
  }

  public get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  constructor(
    private elementReference: ElementRef<HTMLElement>
  ) {
  }
}
