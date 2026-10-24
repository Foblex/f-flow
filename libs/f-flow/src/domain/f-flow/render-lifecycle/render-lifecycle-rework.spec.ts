import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FFlowComponent, FFlowModule } from '@foblex/flow';
import { FComponentsStore } from '../../../f-storage';

// Specs for the debounce-free nodes pipeline: the 120ms wall-clock debounce was
// removed in favor of the store's microtask coalescing + afterNextPaint, and the
// grace/re-arm mechanics below cover what the wall clock used to hide (see
// docs/render-lifecycle-rework.md).

interface ISpecNode {
  id: string;
  parentId: string | null;
  position: { x: number; y: number };
}

@Component({
  standalone: true,
  imports: [FFlowModule],
  template: `
    <f-flow
      style="display: block; width: 800px; height: 600px"
      (fFullRendered)="onFullRendered()"
    >
      <f-canvas>
        @for (n of nodes(); track n.id) {
          <div fNode [fNodeId]="n.id" [fNodePosition]="n.position" style="width: 100px; height: 60px">
            {{ n.id }}
          </div>
        }
      </f-canvas>
    </f-flow>
  `,
})
class AsyncDataHostComponent {
  public readonly nodes = signal<ISpecNode[]>([]);
  public fullRenderedCount = 0;
  public nodesInDomAtFullRendered = -1;

  public onFullRendered(): void {
    this.fullRenderedCount++;
    this.nodesInDomAtFullRendered = document.querySelectorAll('.f-node').length;
  }
}

@Component({
  standalone: true,
  imports: [FFlowModule],
  template: `
    <f-flow fDraggable style="display: block; width: 800px; height: 600px">
      <f-canvas>
        @for (n of nodes(); track n.id) {
          <div
            fNode
            [fNodeId]="n.id"
            [fNodePosition]="n.position"
            [fNodeParentId]="n.parentId"
            style="width: 100px; height: 60px"
          >
            {{ n.id }}
          </div>
        }
        <div
          fGroup
          fGroupId="group"
          [fGroupPosition]="{ x: 300, y: 300 }"
          style="width: 200px; height: 150px"
        >
          Group
        </div>
      </f-canvas>
    </f-flow>
  `,
})
class GroupHostComponent {
  public readonly nodes = signal<ISpecNode[]>([]);
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function settle(fixture: { detectChanges(): void }, ms = 80): Promise<void> {
  for (let i = 0; i < 3; i++) {
    fixture.detectChanges();
    await wait(ms);
  }
  fixture.detectChanges();
}

describe('render lifecycle without the wall-clock debounce', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncDataHostComponent, GroupHostComponent],
    }).compileComponents();
  });

  it('waits for async data instead of latching fFullRendered on an empty canvas', async () => {
    const fixture = TestBed.createComponent(AsyncDataHostComponent);
    fixture.detectChanges();

    // data arrives inside the old 120ms window — and inside the grace
    await wait(60);
    expect(fixture.componentInstance.fullRenderedCount).toBe(0);

    fixture.componentInstance.nodes.set([
      { id: 'a', parentId: null, position: { x: 0, y: 0 } },
      { id: 'b', parentId: null, position: { x: 150, y: 0 } },
    ]);
    await settle(fixture);

    expect(fixture.componentInstance.fullRenderedCount).toBe(1);
    expect(fixture.componentInstance.nodesInDomAtFullRendered).toBe(2);
  });

  it('still completes the lifecycle for a legitimately empty flow after the grace', async () => {
    const fixture = TestBed.createComponent(AsyncDataHostComponent);
    fixture.detectChanges();

    await settle(fixture, 100);

    expect(fixture.componentInstance.fullRenderedCount).toBe(1);
  });

  it('does not touch the DOM when the layer order is already settled', async () => {
    const fixture = TestBed.createComponent(GroupHostComponent);
    fixture.componentInstance.nodes.set([
      { id: 'child', parentId: 'group', position: { x: 310, y: 310 } },
      { id: 'free', parentId: null, position: { x: 0, y: 0 } },
    ]);
    fixture.detectChanges();
    await settle(fixture);

    const store = fixture.debugElement
      .query(By.directive(FFlowComponent))
      .injector.get(FComponentsStore);
    const container = store.nodes.get('child')?.hostElement.parentElement as HTMLElement;

    const mutations: MutationRecord[] = [];
    const observer = new MutationObserver((records) => mutations.push(...records));
    observer.observe(container, { childList: true });

    store.emitNodeChanges();
    await settle(fixture);

    observer.disconnect();
    expect(mutations.length).toBe(0);
  });

  it('reruns the pass skipped during a drag right after pointer-up', async () => {
    const fixture = TestBed.createComponent(GroupHostComponent);
    fixture.componentInstance.nodes.set([{ id: 'a', parentId: null, position: { x: 0, y: 0 } }]);
    fixture.detectChanges();
    await settle(fixture);

    const store = fixture.debugElement
      .query(By.directive(FFlowComponent))
      .injector.get(FComponentsStore);

    // start dragging node "a"
    const nodeEl = store.nodes.get('a')?.hostElement as HTMLElement;
    const rect = nodeEl.getBoundingClientRect();
    const sx = rect.x + rect.width / 2;
    const sy = rect.y + rect.height / 2;
    const init = (x: number, y: number): MouseEventInit => ({
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      button: 0,
      buttons: 1,
    });
    nodeEl.dispatchEvent(new MouseEvent('mousedown', init(sx, sy)));
    for (let i = 1; i <= 4; i++) {
      document.dispatchEvent(new MouseEvent('mousemove', init(sx + i * 10, sy)));
      await wait(10);
    }

    // a group child registers mid-drag: the pass fires, hits the drag guard, is skipped
    fixture.componentInstance.nodes.update((nodes) => [
      { id: 'late-child', parentId: 'group', position: { x: 320, y: 320 } },
      ...nodes,
    ]);
    fixture.detectChanges();
    await wait(120);

    expect(store.hasPendingNodesPassAfterDrag).toBe(true);

    document.dispatchEvent(new PointerEvent('pointerup', { ...init(sx + 40, sy), pointerId: 1 }));
    await settle(fixture);

    // the re-armed pass ran: the flag is consumed and the late child was layer-sorted
    expect(store.hasPendingNodesPassAfterDrag).toBe(false);
    const lateChild = store.nodes.get('late-child');
    const container = lateChild?.hostElement.parentElement as HTMLElement;
    expect(container.lastElementChild).toBe(lateChild?.hostElement as Element);
  });
});
