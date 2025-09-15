import { booleanAttribute, Directive, input, isDevMode } from '@angular/core';

let warnedFConnectionCenter = false;
/** @deprecated '[fConnectionCenter] is deprecated and will be removed in v18.0.0. Use FConnectionContent directive instead.' */
@Directive({
  selector: '[fConnectionCenter]',
})
export class FConnectionCenterDirective {
  /**
   * @deprecated '[fConnectionCenter] is deprecated and will be removed in v18.0.0. Use FConnectionContent directive instead.'
   */
  readonly fConnectionCenter = input<boolean, unknown>(true, {
    alias: 'fConnectionCenter',
    transform: (v: unknown) => {
      // Превращаем presence-атрибут в boolean
      const val = booleanAttribute(v);
      if (!warnedFConnectionCenter && isDevMode()) {
        warnedFConnectionCenter = true;
        console.warn(
          '[fConnectionCenter] is deprecated and will be removed in v18.0.0. Use [FConnectionContent] instead.',
        );
      }

      return val;
    },
  });
}
