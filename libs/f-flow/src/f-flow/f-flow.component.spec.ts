import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FFlowModule } from '@foblex/flow';
import { FComponentsStore } from '../f-storage';
import { FFlowComponent } from '@foblex/flow';

@Component({
  standalone: true,
  imports: [FFlowModule],
  template: `
    <f-flow
      (fNodesRendered)="nodesRenderedIds.push($event)"
      (fFullRendered)="fullRenderedIds.push($event)"
      (fLoaded)="loadedIds.push($event)"
    >
      <f-canvas></f-canvas>
    </f-flow>
  `,
})
class HostComponent {
  public nodesRenderedIds: string[] = [];
  public fullRenderedIds: string[] = [];
  public loadedIds: string[] = [];
}

@Component({
  standalone: true,
  imports: [FFlowModule],
  template: `
    <f-flow>
      <f-canvas>
        <div
          fNode
          fNodeId="node-1"
          [fNodePosition]="{ x: 0, y: 0 }"
          style="width: 120px; height: 80px; padding: 0; margin: 0;"
        >
          Node
        </div>
      </f-canvas>
    </f-flow>
  `,
})
class HostStateComponent {}

describe('FFlowComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, HostStateComponent],
    }).compileComponents();
  });

  it('should wait for progressive rendering before emitting flow loaded events', fakeAsync(() => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const flowDebugElement = fixture.debugElement.query(By.directive(FFlowComponent));
    const store = flowDebugElement.injector.get(FComponentsStore);

    store.beginProgressiveRender();
    store.emitNodeChanges();

    tick(300);
    fixture.detectChanges();

    expect(fixture.componentInstance.nodesRenderedIds).toEqual([]);
    expect(fixture.componentInstance.fullRenderedIds).toEqual([]);
    expect(fixture.componentInstance.loadedIds).toEqual([]);

    store.endProgressiveRender();

    tick(300);
    fixture.detectChanges();

    expect(fixture.componentInstance.nodesRenderedIds.length).toBe(1);
    expect(fixture.componentInstance.nodesRenderedIds[0]).toContain('f-flow-');
    expect(fixture.componentInstance.fullRenderedIds.length).toBe(1);
    expect(fixture.componentInstance.fullRenderedIds[0]).toContain('f-flow-');
    expect(fixture.componentInstance.loadedIds.length).toBe(1);
    expect(fixture.componentInstance.loadedIds[0]).toContain('f-flow-');
  }));

  it('should include measured node sizes when requested', fakeAsync(() => {
    const fixture = TestBed.createComponent(HostStateComponent);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const flow = fixture.debugElement.query(By.directive(FFlowComponent))
      .componentInstance as FFlowComponent;

    expect(flow.getState().nodes[0].size).toBeUndefined();

    const nodeState = flow.getState({ measuredSize: true }).nodes[0];
    const measuredSize = nodeState.measuredSize;

    expect(nodeState.size).toBeUndefined();
    expect(measuredSize).toBeDefined();
    expect(measuredSize?.width).toBeGreaterThan(0);
    expect(measuredSize?.height).toBeGreaterThan(0);
  }));
});
