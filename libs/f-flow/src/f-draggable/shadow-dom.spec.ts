import { Component, ViewEncapsulation } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  FCreateConnectionEvent,
  FFlowModule,
  provideFFlow,
  withConnectionFlow,
} from '@foblex/flow';
import { FMoveNodesEvent } from './drag-node';

@Component({
  standalone: true,
  imports: [FFlowModule],
  providers: [provideFFlow(withConnectionFlow('click'))],
  encapsulation: ViewEncapsulation.ShadowDom,
  styles: [
    `
      :host,
      f-flow {
        display: block;
        width: 600px;
        height: 400px;
      }

      [fNode] {
        width: 100px;
        height: 60px;
      }

      [fConnector] {
        display: block;
        width: 20px;
        height: 20px;
      }
    `,
  ],
  template: `
    <f-flow
      fDraggable
      (fMoveNodes)="moveEvents.push($event)"
      (fCreateConnection)="connectionEvents.push($event)"
    >
      <f-canvas>
        <f-connection-for-create />

        <div
          fNode
          fDragHandle
          fNodeId="source-node"
          [fNodePosition]="{ x: 40, y: 50 }"
        >
          <button
            fConnector
            fConnectorId="source"
            fConnectorType="source"
            type="button"
          >Source</button>
        </div>

        <div fNode fNodeId="target-node" [fNodePosition]="{ x: 300, y: 50 }">
          <button
            fConnector
            fConnectorId="target"
            fConnectorType="target"
            type="button"
          >Target</button>
        </div>
      </f-canvas>
    </f-flow>
  `,
})
class ShadowDomFlowHost {
  public readonly moveEvents: FMoveNodesEvent[] = [];
  public readonly connectionEvents: FCreateConnectionEvent[] = [];
}

describe('FDraggable in Shadow DOM', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShadowDomFlowHost],
    }).compileComponents();
  });

  it('drags a node using the original composed event target', fakeAsync(() => {
    const fixture = TestBed.createComponent(ShadowDomFlowHost);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const shadowRoot = fixture.nativeElement.shadowRoot as ShadowRoot;
    const node = shadowRoot.querySelector('[data-f-node-id="source-node"]') as HTMLElement;

    expect(node.classList).toContain('f-drag-handle');

    const pointerDown = new MouseEvent('mousedown', {
      bubbles: true,
      composed: true,
      button: 0,
      buttons: 1,
      clientX: 100,
      clientY: 100,
    });
    Object.defineProperties(pointerDown, {
      offsetX: { value: 10 },
      offsetY: { value: 10 },
    });
    node.dispatchEvent(pointerDown);

    expect(node.classList).toContain('f-selected');
    document.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        buttons: 1,
        clientX: 130,
        clientY: 120,
      }),
    );
    document.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        button: 0,
        pointerType: 'mouse',
        clientX: 130,
        clientY: 120,
      }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.moveEvents.length).toBe(1);
    expect(fixture.componentInstance.moveEvents[0].nodes).toEqual([
      { id: 'source-node', position: { x: 70, y: 70 } },
    ]);
  }));

  it('creates a connection on a node body across the shadow boundary', fakeAsync(() => {
    const fixture = TestBed.createComponent(ShadowDomFlowHost);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const shadowRoot = fixture.nativeElement.shadowRoot as ShadowRoot;
    const source = shadowRoot.querySelector('[data-f-connector-id="source"]') as HTMLElement;
    const targetNode = shadowRoot.querySelector('[data-f-node-id="target-node"]') as HTMLElement;

    dispatchClick(source);
    dispatchClick(targetNode);
    fixture.detectChanges();

    expect(fixture.componentInstance.connectionEvents.length).toBe(1);
    expect(fixture.componentInstance.connectionEvents[0].sourceId).toBe('source');
    expect(fixture.componentInstance.connectionEvents[0].targetId).toBe('target');
  }));
});

function dispatchClick(element: HTMLElement): void {
  const rect = element.getBoundingClientRect();
  const clientX = rect.left + rect.width / 2;
  const clientY = rect.top + rect.height / 2;

  element.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      composed: true,
      pointerType: 'mouse',
      button: 0,
      buttons: 1,
      clientX,
      clientY,
    }),
  );
  element.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      composed: true,
      button: 0,
      clientX,
      clientY,
    }),
  );
}
