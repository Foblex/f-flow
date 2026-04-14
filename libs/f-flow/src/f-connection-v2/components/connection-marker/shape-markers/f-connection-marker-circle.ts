import { Component, ElementRef, input, viewChild } from '@angular/core';
import { EFMarkerType } from '../enums';
import { F_CONNECTION_MARKER, FConnectionMarkerBase } from '../models';
import { coerceMarkerType } from '../utils';

@Component({
  selector: 'f-connection-marker-circle',
  standalone: true,
  template: `
    <svg #markerElement viewBox="0 0 10 10" class="f-marker">
      <svg:circle cx="5" cy="5" r="5" />
    </svg>
  `,
  host: {
    class: 'f-component',
    style: 'display: none;',
  },
  providers: [{ provide: F_CONNECTION_MARKER, useExisting: FConnectionMarkerCircle }],
})
export class FConnectionMarkerCircle extends FConnectionMarkerBase {
  private readonly _markerElement = viewChild.required<ElementRef<SVGSVGElement>>('markerElement');

  public readonly _type = input(EFMarkerType.START_ALL_STATES, {
    alias: 'type',
    transform: (value: unknown) => coerceMarkerType(value, EFMarkerType.START_ALL_STATES),
  });

  public override get markerElement(): SVGSVGElement {
    return this._markerElement().nativeElement;
  }

  public override width = 5;

  public override height = 5;

  public override refX = 2.5;

  public override refY = 2.5;

  public override get type(): EFMarkerType {
    return this._type();
  }

  public override orient: 'auto' | 'auto-start-reverse' | string = 'auto';

  public override markerUnits: 'strokeWidth' | 'userSpaceOnUse' = 'strokeWidth';
}
