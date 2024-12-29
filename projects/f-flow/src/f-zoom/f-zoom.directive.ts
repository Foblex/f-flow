import {
  AfterViewInit,
  Directive, Input, OnDestroy
} from "@angular/core";
import { F_ZOOM, FZoomBase } from './f-zoom-base';
import { castToBoolean } from '@foblex/utils';

@Directive({
  selector: "f-canvas[fZoom]",
  exportAs: 'fComponent',
  host: {
    'class': 'f-zoom f-component'
  },
  providers: [ { provide: F_ZOOM, useExisting: FZoomDirective } ],
})
export class FZoomDirective extends FZoomBase implements AfterViewInit, OnDestroy {

  @Input('fZoom')
  public get fFlowZoom(): boolean {
    return this.isEnabled;
  }

  public set fFlowZoom(isEnabled: boolean | undefined | string) {
    const value = castToBoolean(isEnabled);
    if (value !== this.isEnabled) {
      this.isEnabled = value;
      this.toggleZoom();
    }
  }

  @Input('fZoomMinimum')
  public override minimum: number = 0.1;

  @Input('fZoomMaximum')
  public override maximum: number = 4;

  @Input('fZoomStep')
  public override step: number = 0.1;

  @Input('fZoomDblClickStep')
  public override dblClickStep: number = 0.5;

  public ngAfterViewInit(): void {
    super.toggleZoom();
  }

  public ngOnDestroy(): void {
    super.dispose();
  }
}
