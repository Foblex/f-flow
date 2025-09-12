import { computed, Directive, input } from '@angular/core';
import { EFResizeHandleType } from './e-f-resize-handle-type';
import { castToEnum } from '@foblex/utils';

@Directive({
  selector: '[fResizeHandle]',
  host: {
    class: `f-resize-handle f-component`,
    '[attr.data-f-resize-handle-type]': 'type().toUpperCase()',
    '[class]': 'class()',
  },
})
export class FResizeHandleDirective {
  public type = input.required<EFResizeHandleType, unknown>({
    alias: 'fResizeHandleType',
    transform: (x) => castToEnum<EFResizeHandleType>(x, 'fResizeHandleType', EFResizeHandleType),
  });

  protected class = computed(() => {
    return `f-resize-handle-${EFResizeHandleType[this.type().toUpperCase() as keyof typeof EFResizeHandleType]}`;
  });
}
