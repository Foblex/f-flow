import { Component, PLATFORM_ID } from '@angular/core';
import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { FFlowModule } from '@foblex/flow';

// Regression: <f-minimap> subscribed to transform changes in ngAfterViewInit with no
// browser guard; the notifyOnStart() + debounceAnimationFrame() pipe then called the
// bare requestAnimationFrame global from a microtask during server rendering, so any
// SSR/prerendered page with a minimap failed with
// "ReferenceError: requestAnimationFrame is not defined". The isBrowser guard lived
// inside _redraw() — downstream of the throwing call. The spec emulates the server:
// PLATFORM_ID 'server' and no rAF globals.

@Component({
  standalone: true,
  imports: [FFlowModule],
  template: `
    <f-flow>
      <f-canvas>
        <div fNode [fNodePosition]="{ x: 0, y: 0 }" style="width: 100px; height: 60px">a</div>
      </f-canvas>
      <f-minimap />
    </f-flow>
  `,
})
class HostComponent {}

describe('FMinimap on the server', () => {
  it('initializes without requestAnimationFrame', fakeAsync(() => {
    const originalRaf = window.requestAnimationFrame;
    const originalCancel = window.cancelAnimationFrame;
    delete (window as unknown as Record<string, unknown>)['requestAnimationFrame'];
    delete (window as unknown as Record<string, unknown>)['cancelAnimationFrame'];

    try {
      TestBed.configureTestingModule({
        imports: [HostComponent],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });

      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      // the crash fired from a queued microtask right after subscription
      flushMicrotasks();

      expect(fixture.nativeElement.querySelector('f-minimap')).not.toBeNull();
    } finally {
      window.requestAnimationFrame = originalRaf;
      window.cancelAnimationFrame = originalCancel;
    }
  }));
});
