import { Component, ElementRef, input, viewChild } from '@angular/core';
import { EFMarkerType } from '../enums';
import { F_CONNECTION_MARKER, FConnectionMarkerBase } from '../models';
import { coerceMarkerType } from '../utils';

@Component({
  selector: 'f-connection-marker-arrow',
  standalone: true,
  template: `
    <svg #markerElement viewBox="0 0 6 7" class="connection-marker">
      <svg:path d="M0.000391006 0L6 3.5L0.000391006 7L0.000391006 0Z" />
    </svg>
  `,
  host: {
    class: 'f-component f-connection-marker',
    style: 'display: none;',
  },
  providers: [{ provide: F_CONNECTION_MARKER, useExisting: FConnectionMarkerArrow }],
})
export class FConnectionMarkerArrow extends FConnectionMarkerBase {
  private readonly _markerElement = viewChild.required<ElementRef<SVGSVGElement>>('markerElement');

  public readonly _type = input(EFMarkerType.END_ALL_STATES, {
    alias: 'type',
    transform: (value: unknown) => coerceMarkerType(value, EFMarkerType.END_ALL_STATES),
  });

  public override get markerElement(): SVGSVGElement {
    return this._markerElement().nativeElement;
  }

  public override width = 6;

  public override height = 7;

  public override refX = 5.5;

  public override refY = 3.5;

  public override get type(): EFMarkerType {
    return this._type();
  }

  public override orient: 'auto' | 'auto-start-reverse' | string = 'auto';

  public override markerUnits: 'strokeWidth' | 'userSpaceOnUse' = 'strokeWidth';
}
