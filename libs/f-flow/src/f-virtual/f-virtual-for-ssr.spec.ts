import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FVirtualFor } from './f-virtual-for';

// Regression: on the server there is no global requestAnimationFrame, and the
// directive used to call it bare inside the initial ngOnChanges — any SSR or
// prerendered route using *fVirtualFor failed to render. The spec emulates the
// server: PLATFORM_ID 'server' and no rAF global.

@Component({
  standalone: true,
  imports: [FVirtualFor],
  template: `
    <div *fVirtualFor="let item of items" class="virtual-item">{{ item }}</div>
  `,
})
class HostComponent {
  public items = ['a', 'b', 'c', 'd', 'e'];
}

describe('FVirtualFor on the server', () => {
  it('renders every item synchronously without requestAnimationFrame', () => {
    const originalRaf = window.requestAnimationFrame;
    const originalCancel = window.cancelAnimationFrame;
    // emulate Node: the globals do not exist at all
    delete (window as unknown as Record<string, unknown>)['requestAnimationFrame'];
    delete (window as unknown as Record<string, unknown>)['cancelAnimationFrame'];

    try {
      TestBed.configureTestingModule({
        imports: [HostComponent],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });

      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('.virtual-item');
      expect(items.length).toBe(5);
    } finally {
      window.requestAnimationFrame = originalRaf;
      window.cancelAnimationFrame = originalCancel;
    }
  });
});
