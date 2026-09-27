import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FFlowModule } from '@foblex/flow';

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
    <f-flow fDraggable>
      <f-canvas>
        <div fNode fNodeId="a" [fNodePosition]="{ x: 0, y: 0 }">
          <button fConnector fConnectorId="out" fConnectorType="source" type="button">o</button>
        </div>
        <div fNode fNodeId="b" [fNodePosition]="{ x: 300, y: 0 }">
          <button fConnector fConnectorId="in" fConnectorType="target" type="button">i</button>
        </div>
        <f-connection fSourceId="out" fTargetId="in">
          <svg fMarker class="probe-marker" width="8" height="8"></svg>
          <div fConnectionContent>
            <svg class="probe-icon" width="10" height="10"></svg>
          </div>
        </f-connection>
      </f-canvas>
    </f-flow>
  `,
})
class StyleScopingHost {}

/**
 * With `ViewEncapsulation.None` the connection styles are global, so their svg rules
 * must target the component's OWN root svg (`> svg`) only. Under the old emulated
 * encapsulation `:host svg` never reached projected content; these specs pin that
 * contract so custom `svg[fMarker]` markers and svg icons inside `[fConnectionContent]`
 * keep their own layout (see #329).
 */
describe('FConnection style scoping', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StyleScopingHost] }).compileComponents();
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(StyleScopingHost);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    return fixture.nativeElement as HTMLElement;
  }

  it('keeps fill:none and pointer-events:stroke on the connection paths', fakeAsync(() => {
    const root = render();
    const selection = root.querySelector(
      'f-connection path[fConnectionSelection]',
    ) as SVGPathElement;
    const path = root.querySelector('f-connection path[f-connection-path]') as SVGPathElement;

    expect(selection).withContext('selection path exists').toBeTruthy();
    expect(getComputedStyle(selection).fill).toBe('none');
    expect(getComputedStyle(selection).pointerEvents).toBe('stroke');
    expect(path).withContext('main path exists').toBeTruthy();
    expect(getComputedStyle(path).fill).toBe('none');
  }));

  it('keeps the connection root svg position:absolute', fakeAsync(() => {
    const root = render();
    const ownSvg = root.querySelector('f-connection > svg') as SVGSVGElement;

    expect(ownSvg).toBeTruthy();
    expect(getComputedStyle(ownSvg).position).toBe('absolute');
  }));

  it('leaves a projected user svg inside fConnectionContent with its default layout', fakeAsync(() => {
    render();
    const icon = document.querySelector('.probe-icon') as SVGSVGElement;

    expect(icon).withContext('projected icon exists').toBeTruthy();
    expect(icon.isConnected).withContext('projected icon is attached').toBe(true);
    expect(icon.matches('f-connection > svg'))
      .withContext('the own-svg rule must not match projected user svg')
      .toBe(false);
    expect(getComputedStyle(icon).position).toBe('static');
  }));

  it('leaves a projected user marker svg unstyled by the connection rules', fakeAsync(() => {
    render();
    const marker = document.querySelector('.probe-marker') as SVGSVGElement;

    expect(marker).withContext('projected marker exists').toBeTruthy();
    expect(marker.parentElement?.tagName.toLowerCase())
      .withContext('marker is projected inside the root svg')
      .toBe('svg');
    expect(marker.matches('f-connection > svg'))
      .withContext('the own-svg rule must not match svg[fMarker]')
      .toBe(false);
  }));
});
