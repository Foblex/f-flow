import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FFlowComponent, FFlowModule } from '@foblex/flow';

// `fDropToGroup` toggles the drop-to-group gesture. On by default, the flow
// carries the `f-drop-to-group` class so the grouping styles apply; turning it
// off drops the class (and, in the pipeline, the reparenting). The class is a
// reactive host binding, so it must also track runtime changes.
@Component({
  standalone: true,
  imports: [FFlowModule],
  template: `
    <f-flow fDraggable [fDropToGroup]="enabled">
      <f-canvas></f-canvas>
    </f-flow>
  `,
})
class HostComponent {
  public enabled = true;
}

describe('fDropToGroup — flow drop-to-group class', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  function flowElement(
    fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>,
  ): HTMLElement {
    return fixture.debugElement.query(By.directive(FFlowComponent)).nativeElement as HTMLElement;
  }

  it('carries the f-drop-to-group class when enabled (default)', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(flowElement(fixture).classList.contains('f-drop-to-group')).toBe(true);
  });

  it('drops the class when fDropToGroup is false', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.enabled = false;
    fixture.detectChanges();

    expect(flowElement(fixture).classList.contains('f-drop-to-group')).toBe(false);
  });

  it('tracks the input when it flips at runtime', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(flowElement(fixture).classList.contains('f-drop-to-group')).toBe(true);

    fixture.componentInstance.enabled = false;
    fixture.detectChanges();
    expect(flowElement(fixture).classList.contains('f-drop-to-group')).toBe(false);

    fixture.componentInstance.enabled = true;
    fixture.detectChanges();
    expect(flowElement(fixture).classList.contains('f-drop-to-group')).toBe(true);
  });
});
