import { Directive, ElementRef, effect, inject, input, Renderer2 } from '@angular/core';
import { TUmlRelationKind } from '../domain';

@Directive({
  selector: '[umlRelationClass]',
  standalone: true,
})
export class UmlRelationClass {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _renderer = inject(Renderer2);
  public readonly umlRelationClass = input<TUmlRelationKind | undefined>(undefined);

  private _currentClass: string | null = null;

  private readonly _syncClass = effect(() => {
    const kind = this.umlRelationClass();
    const nextClass = kind ? `relation-${kind}` : null;

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
