// eslint-disable-next-line max-classes-per-file -- one host component per scenario
import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FCanvasComponent, FFlowModule, provideFFlow, withInitialView } from '@foblex/flow';
import { PointExtensions } from '../../_libs/f-2d';

// withInitialView(): the flow renders invisibly until the first full render and the
// viewport work queued by the (fFullRendered) handler have been applied, so the first
// visible frame already carries the fitted viewport instead of jumping to it.

@Component({
  standalone: true,
  imports: [FFlowModule],
  providers: [provideFFlow(withInitialView())],
  template: `
    <f-flow
      style="display: block; width: 800px; height: 600px"
      (fFullRendered)="onFullRendered()"
    >
      <f-canvas>
        @for (n of nodes(); track n.id) {
          <div
            fNode
            [fNodeId]="n.id"
            [fNodePosition]="n.position"
            style="width: 100px; height: 60px"
          >
            {{ n.id }}
          </div>
        }
      </f-canvas>
    </f-flow>
  `,
})
class HostComponent {
  public readonly canvas = viewChild.required(FCanvasComponent);
  public readonly nodes = signal([
    { id: 'a', position: { x: 0, y: 0 } },
    { id: 'b', position: { x: 2000, y: 2000 } },
  ]);
  public visibilityInsideHook = '';
  public fitOnFullRendered = true;

  public onFullRendered(): void {
    const flowHost = document.querySelector('f-flow') as HTMLElement;
    this.visibilityInsideHook = getComputedStyle(flowHost).visibility;

    if (this.fitOnFullRendered) {
      this.canvas().fitToScreen(PointExtensions.initialize(20, 20), false, false);
    }
  }
}

@Component({
  standalone: true,
  imports: [FFlowModule],
  template: `
    <f-flow
      fInitialView
      style="display: block; width: 800px; height: 600px"
      (fFullRendered)="onFullRendered()"
    >
      <f-canvas>
        <div fNode [fNodePosition]="{ x: 0, y: 0 }" style="width: 100px; height: 60px">a</div>
      </f-canvas>
    </f-flow>
  `,
})
class InputHostComponent {
  public readonly canvas = viewChild.required(FCanvasComponent);
  public visibilityInsideHook = '';

  public onFullRendered(): void {
    const flowHost = document.querySelector('f-flow') as HTMLElement;
    this.visibilityInsideHook = getComputedStyle(flowHost).visibility;
    this.canvas().resetScaleAndCenter(false, false);
  }
}

@Component({
  standalone: true,
  imports: [FFlowModule],
  providers: [provideFFlow(withInitialView())],
  template: `
    <f-flow [fInitialView]="false" style="display: block; width: 800px; height: 600px">
      <f-canvas>
        <div fNode [fNodePosition]="{ x: 0, y: 0 }" style="width: 100px; height: 60px">a</div>
      </f-canvas>
    </f-flow>
  `,
})
class InputOverridesProviderHostComponent {}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function settle(fixture: { detectChanges(): void }): Promise<void> {
  for (let i = 0; i < 3; i++) {
    fixture.detectChanges();
    await wait(80);
  }
  fixture.detectChanges();
}

describe('withInitialView', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, InputHostComponent, InputOverridesProviderHostComponent],
    }).compileComponents();
  });

  it('lets a bound fInitialView input disable what the provider enabled', async () => {
    const fixture = TestBed.createComponent(InputOverridesProviderHostComponent);
    fixture.detectChanges();

    const flowHost = document.querySelector('f-flow') as HTMLElement;
    expect(getComputedStyle(flowHost).visibility).toBe('visible');
  });

  it('is also enabled by the fInitialView input, without providers', async () => {
    const fixture = TestBed.createComponent(InputHostComponent);
    fixture.detectChanges();

    const flowHost = document.querySelector('f-flow') as HTMLElement;
    expect(getComputedStyle(flowHost).visibility).toBe('hidden');

    await settle(fixture);

    expect(fixture.componentInstance.visibilityInsideHook).toBe('hidden');
    expect(getComputedStyle(flowHost).visibility).toBe('visible');
  });

  it('keeps the flow hidden inside the hook and reveals it with the fitted viewport', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const flowHost = document.querySelector('f-flow') as HTMLElement;
    expect(getComputedStyle(flowHost).visibility).toBe('hidden');

    // record the style-mutation order: the canvas transform must land before the reveal
    const order: string[] = [];
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const el = record.target as HTMLElement;
        if (el.tagName === 'F-CANVAS' && el.style.transform) {
          order.push('transform');
        }
        if (el.tagName === 'F-FLOW' && el.style.visibility !== 'hidden') {
          order.push('reveal');
        }
      }
    });
    observer.observe(flowHost, { attributes: true, attributeFilter: ['style'], subtree: true });

    await settle(fixture);
    observer.disconnect();

    expect(fixture.componentInstance.visibilityInsideHook).toBe('hidden');
    expect(getComputedStyle(flowHost).visibility).toBe('visible');

    // the 2000px-spread graph only fits an 800x600 host scaled down
    const transform = (document.querySelector('f-canvas') as HTMLElement).style.transform;
    const scale = Number(transform.replace('matrix(', '').split(',')[0]);
    expect(scale).toBeGreaterThan(0);
    expect(scale).toBeLessThan(1);

    const revealIndex = order.indexOf('reveal');
    const transformIndex = order.indexOf('transform');
    expect(transformIndex).toBeGreaterThanOrEqual(0);
    expect(revealIndex).toBeGreaterThan(transformIndex);
  });

  it('reveals the flow even when the hook queues no viewport work', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.fitOnFullRendered = false;
    fixture.detectChanges();

    await settle(fixture);

    const flowHost = document.querySelector('f-flow') as HTMLElement;
    expect(getComputedStyle(flowHost).visibility).toBe('visible');
  });
});
