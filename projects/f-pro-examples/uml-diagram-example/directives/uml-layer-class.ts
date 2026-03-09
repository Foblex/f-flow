import { Directive, ElementRef, effect, inject, input, Renderer2 } from '@angular/core';
import { TUmlLayer } from '../domain';

@Directive({
  selector: '[umlLayerClass]',
  standalone: true,
})
export class UmlLayerClass {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _renderer = inject(Renderer2);
  public readonly umlLayerClass = input<TUmlLayer | undefined>(undefined);

  private _currentClass: string | null = null;

  private readonly _syncClass = effect(() => {
    const layer = this.umlLayerClass();
    const nextClass = layer ? `layer-${layer}` : null;

    if (this._currentClass === nextClass) {
      return;
    }

    if (this._currentClass) {
      this._renderer.removeClass(this._elementRef.nativeElement, this._currentClass);
    }

    this._currentClass = nextClass;

    if (this._currentClass) {
      this._renderer.addClass(this._elementRef.nativeElement, this._currentClass);
    }
  });
}
