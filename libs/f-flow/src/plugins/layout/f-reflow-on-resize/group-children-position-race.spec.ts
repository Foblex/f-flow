import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FFlowComponent, FFlowModule, provideFFlow } from '@foblex/flow';
import { withReflowOnResize } from './with-reflow-on-resize';

// Chrome reports "ResizeObserver loop completed with undelivered
// notifications" as a global error when nested resize observers fire —
// in this spec, fit-to-children moves the group, which triggers another
// observer tick. Karma elevates that into a test failure even though it
// is a harmless warning. Wrap `window.onerror` so the original Karma /
// Jasmine handler never sees it. Other errors fall through unchanged.
const previousOnError = window.onerror;
window.onerror = function (message, source, lineno, colno, error) {
  if (typeof message === 'string' && message.includes('ResizeObserver loop')) {
    return true;
  }
  if (typeof previousOnError === 'function') {
    return previousOnError.call(window, message, source, lineno, colno, error);
  }

  return false;
};

// Regression for https://github.com/Foblex/f-flow/issues/305.
//
// When `provideFFlow(withReflowOnResize())` is active AND a group uses
// `fAutoSizeToFitChildren`, swapping the graph leaves several children of
// the group stuck at the same DOM-measured position instead of their
// assigned `[fNodePosition]`. The signature in the original report is a
// fractional `(x, y)` shared by multiple siblings — clear evidence that
// the values came from DOM rect measurement, not from input.
//
// Trigger combo (both must be on):
//   - `withReflowOnResize(...)` in `provideFFlow(...)`.
//   - `fAutoSizeToFitChildren` on at least one `<f-group>` that holds
//     children whose `[fNodePosition]` we assert against.

interface IReproNode {
  id: string;
  parentId: string | null;
  position: { x: number; y: number };
}

const PARENT_GROUP = 'hostParentGroup';
const CHILDREN_GROUP = 'hostChildrenGroup';

const SMALL_NODES: IReproNode[] = [
  { id: 'small-a', parentId: PARENT_GROUP, position: { x: 225, y: 84 } },
  { id: 'small-b', parentId: null, position: { x: 825, y: 200 } },
  { id: 'small-c', parentId: CHILDREN_GROUP, position: { x: 1425, y: 200 } },
];

// Positions verbatim from issue #305 Dagre output.
const BIG_NODES: IReproNode[] = [
  { id: 'n1', parentId: PARENT_GROUP, position: { x: 225, y: 84 } },
  { id: 'n6', parentId: PARENT_GROUP, position: { x: 225, y: 242 } },
  { id: 'n7', parentId: CHILDREN_GROUP, position: { x: 1425, y: 953 } },
  { id: 'n24', parentId: CHILDREN_GROUP, position: { x: 1425, y: 795 } },
  { id: 'n31', parentId: CHILDREN_GROUP, position: { x: 1425, y: 637 } },
  { id: 'n32', parentId: CHILDREN_GROUP, position: { x: 1425, y: 479 } },
  { id: 'n114', parentId: PARENT_GROUP, position: { x: 225, y: 400 } },
  { id: 'n201', parentId: CHILDREN_GROUP, position: { x: 1425, y: 321 } },
  { id: 'n202', parentId: CHILDREN_GROUP, position: { x: 1425, y: 163 } },
  { id: 'n217', parentId: null, position: { x: 825, y: 558 } },
  { id: 'n218', parentId: PARENT_GROUP, position: { x: 225, y: 558 } },
  { id: 'n219', parentId: PARENT_GROUP, position: { x: 225, y: 716 } },
  { id: 'n226', parentId: PARENT_GROUP, position: { x: 225, y: 874 } },
  { id: 'n227', parentId: PARENT_GROUP, position: { x: 225, y: 1032 } },
];

@Component({
  standalone: true,
  imports: [FFlowModule],
  providers: [provideFFlow(withReflowOnResize())],
  // ResizeObserver and the reflow orchestrator both depend on real
  // measured box geometry — give the host a concrete size so children
  // produce non-zero rects.
  template: `
    <f-flow style="display: block; width: 1600px; height: 1200px">
      <f-canvas>
        <div
          fGroup
          fGroupId="hostParentGroup"
          fAutoSizeToFitChildren
          [fGroupPosition]="{ x: 0, y: 0 }"
          style="width: 200px; height: 100px"
        >
          Parent
        </div>
        <div
          fGroup
          fGroupId="hostChildrenGroup"
          fAutoSizeToFitChildren
          [fGroupPosition]="{ x: 0, y: 0 }"
          style="width: 200px; height: 100px"
        >
          Children
        </div>
        @for (n of nodes(); track n.id) {
          <div
            fNode
            [fNodeId]="n.id"
            [fNodePosition]="n.position"
            [fNodeParentId]="n.parentId ?? null"
            style="width: 120px; height: 80px"
          >
            {{ n.id }}
          </div>
        }
      </f-canvas>
    </f-flow>
  `,
})
class HostComponent {
  public readonly nodes = signal<IReproNode[]>(SMALL_NODES);
}

async function settle(
  fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>,
): Promise<void> {
  // Long enough to drain the ResizeObserver loop and the orchestrator's
  // internal debounces. Short rAFs cause the browser to emit a
  // "ResizeObserver loop completed with undelivered notifications"
  // warning that Karma elevates into a test failure.
  for (let i = 0; i < 3; i++) {
    fixture.detectChanges();
    await new Promise<void>((r) => setTimeout(r, 80));
  }
  fixture.detectChanges();
}

describe('Issue #305 — group children position race', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('keeps each assigned position after a small → big graph swap', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await settle(fixture);

    fixture.componentInstance.nodes.set(BIG_NODES);
    fixture.detectChanges();
    await settle(fixture);

    const flow = fixture.debugElement.query(By.directive(FFlowComponent))
      .componentInstance as FFlowComponent;
    const state = flow.getState();

    const byInputId = new Map<string, { x: number; y: number }>();
    for (const node of state.nodes) {
      const inputId = node.fInputs?.[0]?.id;
      if (inputId) {
        byInputId.set(inputId, node.position);
      } else if (node.id) {
        byInputId.set(node.id, node.position);
      }
    }

    const broken: { id: string; expected: unknown; got: unknown }[] = [];
    for (const expected of BIG_NODES) {
      const got = byInputId.get(expected.id);
      if (
        !got ||
        Math.abs(got.x - expected.position.x) > 0.5 ||
        Math.abs(got.y - expected.position.y) > 0.5
      ) {
        broken.push({ id: expected.id, expected: expected.position, got });
      }
    }

    expect(broken).toEqual([]);
  });
});
