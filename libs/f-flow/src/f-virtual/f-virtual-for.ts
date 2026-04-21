import {
  Directive,
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

  private readonly _vc = inject(ViewContainerRef);
  private readonly _tpl = inject<TemplateRef<FVirtualContext<T>>>(TemplateRef);
  private readonly _zone = inject(NgZone);
  private readonly _componentsStore = inject(FComponentsStore, { optional: true });

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
  }

  private _renderProgressively(): void {
    // Frame budget pump, "measure once, predict chunk" style.
    //
    // Each frame we first run a small calibration batch to learn how long a
    // single createEmbeddedView takes RIGHT NOW (cost varies with the template
    // complexity, the browser, and the size of the existing view tree), then
    // we derive how many more views fit in the remaining budget and burn
    // through them without taking another timestamp per iteration. Two
    // `performance.now()` calls per frame, not one per view.
    //
    // SAFETY_FACTOR (< 1) keeps us strictly under budget so a single slow view
    // in the predicted chunk can't push the frame past 10 ms.
    const FRAME_BUDGET = 10; // ms
    const CALIBRATION_SIZE = 5;
    const SAFETY_FACTOR = 0.9;

    let index = 0;
    this._startProgressiveRender();

    this._zone.runOutsideAngular(() => {
      const pump = () => {
        const total = this.fVirtualForOf.length;
        const start = performance.now();

        // Calibration batch — always run at least a few views so we have a
        // live measurement to work with, even if the previous frame's rate
        // was stale.
        const calibrationEnd = Math.min(total, index + CALIBRATION_SIZE);
        while (index < calibrationEnd) {
          this._insertView(index);
          index++;
        }

        const elapsed = performance.now() - start;
        const done = index >= total;

        if (!done && elapsed < FRAME_BUDGET) {
          const msPerView = elapsed / CALIBRATION_SIZE;
          const remainingBudget = (FRAME_BUDGET - elapsed) * SAFETY_FACTOR;
          const predicted = msPerView > 0 ? Math.floor(remainingBudget / msPerView) : 0;
          const limit = Math.min(total, index + predicted);

          while (index < limit) {
            this._insertView(index);
            index++;
          }
        }

        if (index < total) {
          this._rafId = requestAnimationFrame(pump);

          return;
        }

        this._rafId = null;
        this._finishProgressiveRender();
      };

      this._rafId = requestAnimationFrame(pump);
    });
  }

  private _insertView(index: number): void {
    this._vc.createEmbeddedView(this._tpl, {
      $implicit: this.fVirtualForOf[index],
      index,
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
