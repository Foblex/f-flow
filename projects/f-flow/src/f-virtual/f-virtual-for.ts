import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

interface FVirtualContext<T> {
  $implicit: T;
  index: number;
}

@Directive({
  selector: '[fVirtualFor][fVirtualForOf]',
  standalone: true,
})
export class FVirtualFor<T> implements OnChanges {
  @Input() fVirtualForOf: readonly T[] = [];
  @Input() fVirtualForTrackBy?: (index: number, item: T) => unknown;

  private readonly _vc = inject(ViewContainerRef);
  private readonly _tpl = inject<TemplateRef<FVirtualContext<T>>>(TemplateRef);
  private readonly _zone = inject(NgZone);

  private _views: EmbeddedViewRef<FVirtualContext<T>>[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fVirtualForOf']) {
      this._reset();
      this._renderProgressively();
    }
  }

  private _reset(): void {
    this._vc.clear();
    this._views.length = 0;
  }

  private _renderProgressively(): void {
    const FRAME_BUDGET = 10; // ms
    let index = 0;

    this._zone.runOutsideAngular(() => {
      const pump = () => {
        const start = performance.now();

        while (index < this.fVirtualForOf.length && performance.now() - start < FRAME_BUDGET) {
          const item = this.fVirtualForOf[index];

          const view = this._vc.createEmbeddedView(this._tpl, {
            $implicit: item,
            index,
          });

          this._views.push(view);
          index++;
        }

        if (index < this.fVirtualForOf.length) {
          requestAnimationFrame(pump);
        }
      };

      requestAnimationFrame(pump);
    });
  }
}
