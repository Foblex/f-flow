import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FCreateConnectionEvent, FFlowModule, FSnapTargetChangeEvent } from '@foblex/flow';

@Component({
  standalone: true,
  imports: [FFlowModule],
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
    <f-flow fDraggable (fCreateConnection)="connectionEvents.push($event)">
      <f-canvas>
        <f-connection-for-create />
        <f-snap-connection
          [fSnapThreshold]="50"
          (fSnapTargetChange)="snapEvents.push($event)"
        />

        <div fNode fNodeId="source-node" [fNodePosition]="{ x: 40, y: 50 }">
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
class SnapTargetChangeHost {
  public readonly snapEvents: FSnapTargetChangeEvent[] = [];
  public readonly connectionEvents: FCreateConnectionEvent[] = [];
}

describe('FSnapConnection fSnapTargetChange', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnapTargetChangeHost],
    }).compileComponents();
  });

  it('emits once per acquired, released, and re-acquired snap target', fakeAsync(() => {
    const fixture = TestBed.createComponent(SnapTargetChangeHost);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const source = root.querySelector('[data-f-connector-id="source"]') as HTMLElement;
    const target = root.querySelector('[data-f-connector-id="target"]') as HTMLElement;

    const sourceCenter = centerOf(source);
    const targetCenter = centerOf(target);
    const farPoint = { x: (sourceCenter.x + targetCenter.x) / 2, y: sourceCenter.y + 200 };
    const nearTarget = { x: targetCenter.x - 40, y: targetCenter.y };

    dispatchMouseDown(source, sourceCenter);

    dispatchMouseMove(farPoint);
    dispatchMouseMove({ x: farPoint.x + 5, y: farPoint.y });
    expect(host.snapEvents.length).toBe(0);

    dispatchMouseMove(nearTarget);
    expect(host.snapEvents.length).toBe(1);
    expect(host.snapEvents[0].sourceId).toBe('source');
    expect(host.snapEvents[0].targetId).toBe('target');

    dispatchMouseMove({ x: nearTarget.x - 5, y: nearTarget.y });
    expect(host.snapEvents.length).toBe(1);

    dispatchMouseMove(farPoint);
    expect(host.snapEvents.length).toBe(2);
    expect(host.snapEvents[1].targetId).toBeUndefined();

    dispatchMouseMove(nearTarget);
    expect(host.snapEvents.length).toBe(3);
    expect(host.snapEvents[2].targetId).toBe('target');

    dispatchPointerUp(targetCenter);
    fixture.detectChanges();

    expect(host.snapEvents.length).toBe(4);
    expect(host.snapEvents[3].sourceId).toBe('source');
    expect(host.snapEvents[3].targetId).toBeUndefined();

    expect(host.connectionEvents.length).toBe(1);
    expect(host.connectionEvents[0].fOutputId).toBe('source');
    expect(host.connectionEvents[0].fInputId).toBe('target');
  }));

  it('emits the release once when the gesture ends while snapped', fakeAsync(() => {
    const fixture = TestBed.createComponent(SnapTargetChangeHost);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const source = root.querySelector('[data-f-connector-id="source"]') as HTMLElement;
    const target = root.querySelector('[data-f-connector-id="target"]') as HTMLElement;

    const sourceCenter = centerOf(source);
    const targetCenter = centerOf(target);

    dispatchMouseDown(source, sourceCenter);
    dispatchMouseMove(targetCenter);
    dispatchPointerUp(targetCenter);
    fixture.detectChanges();

    expect(host.snapEvents.map((x) => x.targetId)).toEqual(['target', undefined]);
    expect(host.connectionEvents.length).toBe(1);
  }));

  it('does not emit when the gesture never enters the snap threshold', fakeAsync(() => {
    const fixture = TestBed.createComponent(SnapTargetChangeHost);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const source = root.querySelector('[data-f-connector-id="source"]') as HTMLElement;

    const sourceCenter = centerOf(source);
    const farPoint = { x: sourceCenter.x + 120, y: sourceCenter.y + 200 };

    dispatchMouseDown(source, sourceCenter);
    dispatchMouseMove(farPoint);
    dispatchPointerUp(farPoint);
    fixture.detectChanges();

    expect(host.snapEvents.length).toBe(0);
  }));
});

function centerOf(element: HTMLElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect();

  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function dispatchMouseDown(element: HTMLElement, point: { x: number; y: number }): void {
  element.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      composed: true,
      button: 0,
      buttons: 1,
      clientX: point.x,
      clientY: point.y,
    }),
  );
}

function dispatchMouseMove(point: { x: number; y: number }): void {
  document.dispatchEvent(
    new MouseEvent('mousemove', {
      bubbles: true,
      buttons: 1,
      clientX: point.x,
      clientY: point.y,
    }),
  );
}

function dispatchPointerUp(point: { x: number; y: number }): void {
  document.dispatchEvent(
    new PointerEvent('pointerup', {
      bubbles: true,
      button: 0,
      pointerType: 'mouse',
      clientX: point.x,
      clientY: point.y,
    }),
  );
}
