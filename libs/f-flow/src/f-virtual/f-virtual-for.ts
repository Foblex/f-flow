import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { FComponentsStore } from '../f-storage';

interface FVirtualContext<T> {
  $implicit: T;
  index: number;
}

@Directive({
  selector: '[fVirtualFor][fVirtualForOf]',
  standalone: true,
})
export class FVirtualFor<T> implements OnChanges, OnDestroy {
  @Input() fVirtualForOf: readonly T[] = [];
  @Input() fVirtualForTrackBy?: (index: number, item: T) => unknown;

  private readonly _vc = inject(ViewContainerRef);
  private readonly _tpl = inject<TemplateRef<FVirtualContext<T>>>(TemplateRef);
  private readonly _zone = inject(NgZone);
  private readonly _componentsStore = inject(FComponentsStore, { optional: true });

  private _views: EmbeddedViewRef<FVirtualContext<T>>[] = [];
  private _rafId: number | null = null;
  private _isProgressiveRenderActive = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fVirtualForOf']) {
      this._reset();
      this._renderProgressively();
    }
  }

  ngOnDestroy(): void {
    this._reset();
  }

  private _reset(): void {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }

    this._finishProgressiveRender();
    this._vc.clear();
    this._views.length = 0;
  }

  private _renderProgressively(): void {
    const FRAME_BUDGET = 10; // ms
    let index = 0;
    this._startProgressiveRender();

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
          this._rafId = requestAnimationFrame(pump);

          return;
        }

        this._rafId = null;
        this._finishProgressiveRender();
      };

      this._rafId = requestAnimationFrame(pump);
    });
  }

  private _startProgressiveRender(): void {
    if (this._isProgressiveRenderActive) {
      return;
    }

    this._isProgressiveRenderActive = true;
    this._componentsStore?.beginProgressiveRender();
  }

  private _finishProgressiveRender(): void {
    if (!this._isProgressiveRenderActive) {
      return;
    }

    this._isProgressiveRenderActive = false;
    this._componentsStore?.endProgressiveRender();
  }
}
