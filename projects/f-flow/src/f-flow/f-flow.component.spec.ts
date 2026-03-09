import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FFlowModule } from '../f-flow.module';
import { FComponentsStore } from '../f-storage';
import { FFlowComponent } from './f-flow.component';

@Component({
  standalone: true,
  imports: [FFlowModule],
  template: `
    <f-flow (fLoaded)="loadedIds.push($event)">
      <f-canvas></f-canvas>
    </f-flow>
  `,
})
class HostComponent {
  public loadedIds: string[] = [];
}

describe('FFlowComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  it('should wait for progressive rendering before emitting fLoaded', fakeAsync(() => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const flowDebugElement = fixture.debugElement.query(By.directive(FFlowComponent));
    const store = flowDebugElement.injector.get(FComponentsStore);

    store.beginProgressiveRender();
    store.emitNodeChanges();

    tick(300);
    fixture.detectChanges();

    expect(fixture.componentInstance.loadedIds).toEqual([]);

    store.endProgressiveRender();

    tick(300);
    fixture.detectChanges();

    expect(fixture.componentInstance.loadedIds.length).toBe(1);
    expect(fixture.componentInstance.loadedIds[0]).toContain('f-flow-');
  }));
});
