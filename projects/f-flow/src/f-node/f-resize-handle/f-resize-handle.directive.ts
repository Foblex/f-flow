import {
  Directive, ElementRef, HostBinding, InjectionToken, Input
} from "@angular/core";
import { BooleanExtensions, IHasHostElement } from '@foblex/core';
import { EFResizeHandleType } from './e-f-resize-handle-type';
import { castToEnum } from '../../domain';

export const F_RESIZE_HANDLE: InjectionToken<FResizeHandleDirective> = new InjectionToken<FResizeHandleDirective>('F_RESIZE_HANDLE');

@Directive({
  selector: "[fResizeHandle]",
  host: {
    class: `f-resize-handle f-component`,
    '[class.f-resize-handle-disabled]': 'disabled',
    '[attr.data-f-resize-handle-type]': 'type',
  },
  providers: [ { provide: F_RESIZE_HANDLE, useExisting: FResizeHandleDirective } ],
})
export class FResizeHandleDirective implements IHasHostElement {

  private isDisabled: boolean = false;
  @Input('fResizeHandleDisabled')
  public set disabled(isDisabled: boolean | undefined | string) {
    this.isDisabled = BooleanExtensions.castToBoolean(isDisabled);
  }
  public get disabled(): boolean {
    return this.isDisabled;
  }

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
