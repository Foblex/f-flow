import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FFlowModule } from '@foblex/flow';

// Regression for https://github.com/Foblex/f-flow/issues/304.
//
// `PolylineContentPlace.compute()` runs inside a tight loop in
// `ConnectionContentLayoutEngine.layout()` and is interleaved with
// `style.transform` writes for every label. Reading the label size via
// `getBoundingClientRect()` on every iteration forced a synchronous
// layout flush per label and caused O(N²) browser work at a few
// hundred labelled connections — drag-time stalled and labels appeared
// one-by-one across many frames.
//
// The fix moves the size lookup off the hot path: each label installs
// a `ResizeObserver` once and reports the cached size via
// `IPolylineContent.measureSize()`. This spec proves the hot path
// performs zero direct DOM reads on label hosts across repeated
// redraws — if anyone reintroduces a `getBoundingClientRect()` call
// inside the placement loop, the count would grow with the redraw
// count and this expectation would fail.

@Component({
  standalone: true,
  imports: [FFlowModule],
  template: `
    <f-flow style="display: block; width: 800px; height: 600px">
      <f-canvas>
        <div
          fNode
          fNodeId="src"
          [fNodePosition]="source()"
          fNodeOutput
          fOutputId="src-out"
          style="width: 80px; height: 40px"
        >
          src
        </div>
        @for (target of targets(); track target.id) {
          <div
            fNode
            [fNodeId]="target.id"
            [fNodePosition]="target.position"
            fNodeInput
            [fInputId]="target.id"
            style="width: 60px; height: 30px"
          >
            {{ target.id }}
          </div>
          <f-connection fOutputId="src-out" [fInputId]="target.id" fType="straight">
            <div fConnectionContent>{{ target.id }}</div>
          </f-connection>
        }
      </f-canvas>
    </f-flow>
  `,
})
class HostComponent {
  public readonly source = signal({ x: 0, y: 0 });
  public readonly targets = signal(
    Array.from({ length: 8 }, (_, i) => ({
      id: `target-${i + 1}`,
      position: { x: 200 + (i % 4) * 100, y: 100 + Math.floor(i / 4) * 80 },
    })),
  );
}

describe('Issue #304 — fConnectionContent layout performance', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('does not call getBoundingClientRect on label hosts during repeated source-position redraws', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    // Let mount + the ResizeObserver's first delivery populate the
    // per-label size cache before we start counting.
    for (let i = 0; i < 5; i++) {
      await new Promise<void>((r) => setTimeout(r, 30));
      fixture.detectChanges();
    }

    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    let labelHostReads = 0;
    Element.prototype.getBoundingClientRect = function () {
      if (
        typeof (this as HTMLElement).className === 'string' &&
        (this as HTMLElement).className.includes('f-connection-content')
      ) {
        labelHostReads++;
      }

      return originalGetBoundingClientRect.call(this);
    };

    try {
      // 30 redraws — the planner runs `compute()` and the engine
      // applies `style.transform` on every iteration. Pre-fix, this
      // produced one `getBoundingClientRect` call per label per
      // redraw; post-fix the count must stay at zero.
      for (let i = 1; i <= 30; i++) {
        fixture.componentInstance.source.set({ x: i * 4, y: i * 2 });
        fixture.detectChanges();
        await new Promise<void>((r) => setTimeout(r, 16));
      }
    } finally {
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    }

    expect(labelHostReads).toBe(0);
  });
});
