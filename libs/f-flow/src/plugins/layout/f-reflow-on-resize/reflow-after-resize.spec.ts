import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FFlowModule, provideFFlow } from '@foblex/flow';
import { FNodeDirective } from '../../../f-node';
import { withReflowOnResize } from './with-reflow-on-resize';

// Regression for the "reflow dies after a top/left-handle resize" report.
//
// The resize handler writes `_position` directly on every pointermove and used
// to never mirror the final position back into the `fNodePosition` model. A
// top-handle resize therefore left the model and `_position` permanently apart,
// and the orchestrator's mid-flight guard silently skipped the node in every
// later plan — the feature looked alive (sizes kept changing) while no
// neighbour ever shifted again, whatever the runtime config said.

@Component({
  standalone: true,
  imports: [FFlowModule],
  providers: [provideFFlow(withReflowOnResize())],
  template: `
    <f-flow fDraggable style="display: block; width: 800px; height: 600px">
      <f-canvas>
        <div
          fNode
          fNodeId="source"
          [fNodePosition]="sourcePosition"
          style="width: 150px; height: 100px"
        >
          <div fResizeHandle fResizeHandleType="top"></div>
          <div fResizeHandle fResizeHandleType="bottom"></div>
          Source
        </div>
        <div
          fNode
          fNodeId="below"
          [fNodePosition]="belowPosition"
          style="width: 150px; height: 100px"
        >
          Below
        </div>
      </f-canvas>
    </f-flow>
  `,
})
class HostComponent {
  public readonly sourcePosition = { x: 200, y: 150 };
  public readonly belowPosition = { x: 200, y: 300 };
}

async function settle(
  fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>,
): Promise<void> {
  for (let i = 0; i < 3; i++) {
    fixture.detectChanges();
    await new Promise<void>((r) => setTimeout(r, 80));
  }
  fixture.detectChanges();
}

async function dragHandle(handle: HTMLElement, dx: number, dy: number): Promise<void> {
  const rect = handle.getBoundingClientRect();
  const sx = rect.x + rect.width / 2 || 10;
  const sy = rect.y + rect.height / 2 || 10;
  const init = (x: number, y: number): MouseEventInit => ({
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    button: 0,
    buttons: 1,
  });

  handle.dispatchEvent(new MouseEvent('mousedown', init(sx, sy)));
  const steps = 4;
  for (let i = 1; i <= steps; i++) {
    document.dispatchEvent(
      new MouseEvent('mousemove', init(sx + (dx / steps) * i, sy + (dy / steps) * i)),
    );
    await new Promise<void>((r) => setTimeout(r, 10));
  }
  document.dispatchEvent(
    new PointerEvent('pointerup', { ...init(sx + dx, sy + dy), pointerId: 1 }),
  );
  await new Promise<void>((r) => setTimeout(r, 50));
}

describe('reflow after a resize that moves the node', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('keeps the position model in sync and keeps reflowing after a top-handle resize', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await settle(fixture);

    const nodes = fixture.debugElement
      .queryAll(By.directive(FNodeDirective))
      .map((d) => d.injector.get(FNodeDirective));
    const source = nodes.find((n) => n.fId() === 'source') as FNodeDirective;
    const below = nodes.find((n) => n.fId() === 'below') as FNodeDirective;

    const handles = fixture.nativeElement.querySelectorAll('.f-resize-handle');
    const topHandle = handles[0] as HTMLElement;
    const bottomHandle = handles[1] as HTMLElement;

    // grow upward: position.y moves by the drag delta
    await dragHandle(topHandle, 0, -30);
    await settle(fixture);

    expect(source.position().y).toBe(source._position.y);
    expect(source.position().y).toBe(120);

    // reflow must still be alive for this node: growing downward shifts the neighbour
    const belowYBefore = below.position().y;
    await dragHandle(bottomHandle, 0, 40);
    await settle(fixture);

    expect(below.position().y).toBe(belowYBefore + 40);
  });
});
