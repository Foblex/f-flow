import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FComponentsStore, FFlowModule } from '@foblex/flow';

@Component({
  standalone: true,
  imports: [FFlowModule],
  template: `
    <f-flow>
      <f-canvas>
        <div fNode fNodeId="node-1">
          <div fConnector fConnectorId="both"></div>
          <div fConnector fConnectorId="only-source" fConnectorType="source"></div>
          <div fConnector fConnectorId="only-target" fConnectorType="target"></div>
          <div
            fConnector
            fConnectorId="disabled-one"
            fConnectorType="source"
            [fConnectorDisabled]="true"
          ></div>
        </div>
      </f-canvas>
    </f-flow>
  `,
})
class TestFlowComponent {}

describe('FConnectorDirective', () => {
  let store: FComponentsStore;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TestFlowComponent] });
    await TestBed.compileComponents();

    const fixture = TestBed.createComponent(TestFlowComponent);
    fixture.detectChanges();

    hostElement = fixture.nativeElement;
    store = fixture.debugElement.children[0].injector.get(FComponentsStore);
  });

  it('registers only in the unified connectors registry', () => {
    expect(store.connectors.has('both')).toBe(true);
    expect(store.connectors.has('only-source')).toBe(true);
    expect(store.connectors.has('only-target')).toBe(true);

    expect(store.outputs.size()).toBe(0);
    expect(store.inputs.size()).toBe(0);
    expect(store.outlets.size()).toBe(0);
  });

  it('defaults to type source-target', () => {
    const element = hostElement.querySelector('[data-f-connector-id="both"]') as HTMLElement;
    const connector = store.connectors.require('both');

    expect(element.getAttribute('data-f-connector-type')).toBe('source-target');
    expect(element.classList).toContain('f-connector');
    expect(element.classList).toContain('f-connector-source-target');
    expect(element.classList).toContain('f-connector-multiple');
    expect(connector.isSelfConnectable).toBeTrue();
  });

  it('applies type-specific and disabled classes', () => {
    const source = hostElement.querySelector('[data-f-connector-id="only-source"]') as HTMLElement;
    const target = hostElement.querySelector('[data-f-connector-id="only-target"]') as HTMLElement;
    const disabled = hostElement.querySelector(
      '[data-f-connector-id="disabled-one"]',
    ) as HTMLElement;

    expect(source.classList).toContain('f-connector-source');
    expect(target.classList).toContain('f-connector-target');
    expect(disabled.classList).toContain('f-connector-disabled');
  });

  it('does not add legacy connector classes', () => {
    const element = hostElement.querySelector('[data-f-connector-id="both"]') as HTMLElement;

    expect(element.classList).not.toContain('f-node-input');
    expect(element.classList).not.toContain('f-node-output');
    expect(element.classList).not.toContain('f-node-outlet');
  });
});
