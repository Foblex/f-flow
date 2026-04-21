import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HighlightService } from '../index';

@Component({
  selector: 'highlight',
  template: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Highlight implements OnInit {

  private readonly _highlightService = inject(HighlightService);
  private readonly _elementRef = inject(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);

  public content = input.required<string>();
  public language = input.required<string>();

  public ngOnInit() {
    queueMicrotask(() => {
      this._highlightService.highlight(this._elementRef.nativeElement, this.language(), this.content())
        .pipe(
          take(1), takeUntilDestroyed(this._destroyRef),
        ).subscribe();
    })
  }
}
