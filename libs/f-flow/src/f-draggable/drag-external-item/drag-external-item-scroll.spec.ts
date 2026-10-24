import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FCreateNodeEvent, FFlowModule } from '@foblex/flow';

const SCROLL_Y = 300;

@Component({
  standalone: true,
  imports: [FFlowModule],
  styles: [
    `
      .external-item {
        display: block;
        width: 120px;
        height: 40px;
      }

      f-flow {
        display: block;
        width: 600px;
        height: 400px;
      }

      .above {
        height: 400px;
      }

      .below {
        height: 2000px;
      }
    `,
  ],
  template: `
    <div class="above"></div>
    <div class="external-item" fExternalItem [fData]="'item'">External item</div>
    <f-flow fDraggable (fCreateNode)="createEvents.push($event)">
      <f-canvas></f-canvas>
    </f-flow>
    <div class="below"></div>
  `,
})
class ScrolledPageHost {
  public readonly createEvents: FCreateNodeEvent[] = [];
}

describe('DragExternalItem on a scrolled page', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrolledPageHost],
    }).compileComponents();
  });

  afterEach(() => {
    window.scrollTo(0, 0);
  });

  it('keeps the preview under the pointer and reports where it was dropped', fakeAsync(() => {
    const fixture = TestBed.createComponent(ScrolledPageHost);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const item = host.querySelector('.external-item') as HTMLElement;
    const flow = host.querySelector('f-flow') as HTMLElement;

    // The item is below the fold: scroll the page to reach it.
    window.scrollTo(0, SCROLL_Y);
    expect(window.scrollY).toBe(SCROLL_Y);

    const itemRect = item.getBoundingClientRect();
    const grab = { x: 10, y: 15 };
    const start = { x: itemRect.left + grab.x, y: itemRect.top + grab.y };

    const flowRect = flow.getBoundingClientRect();
    const drop = { x: flowRect.left + 300, y: flowRect.top + 100 };

    item.dispatchEvent(mouse('mousedown', start));
    document.dispatchEvent(mouse('mousemove', { x: start.x + 8, y: start.y + 8 }));
    document.dispatchEvent(mouse('mousemove', drop));

    const preview = document.querySelector('.f-external-item-preview') as HTMLElement;
    expect(preview).withContext('preview').not.toBeNull();

    const previewRect = preview.getBoundingClientRect();
    expect(previewRect.left).toBeCloseTo(drop.x - grab.x, 0);
    expect(previewRect.top).toBeCloseTo(drop.y - grab.y, 0);

    document.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        button: 0,
        pointerType: 'mouse',
        clientX: drop.x,
        clientY: drop.y,
      }),
    );
    fixture.detectChanges();

    const events = fixture.componentInstance.createEvents;
    expect(events.length).toBe(1);
    expect(events[0].externalItemRect.x).toBeCloseTo(drop.x - grab.x - flowRect.left, 0);
    expect(events[0].externalItemRect.y).toBeCloseTo(drop.y - grab.y - flowRect.top, 0);
  }));
});

function mouse(type: 'mousedown' | 'mousemove', at: { x: number; y: number }): MouseEvent {
  return new MouseEvent(type, {
    bubbles: true,
    composed: true,
    button: 0,
    buttons: 1,
    clientX: at.x,
    clientY: at.y,
  });
}
