import {
  Directive, ElementRef, Input, OnDestroy, OnInit
} from "@angular/core";
import { F_MARKER, FMarkerBase } from './f-marker-base';
import { EFMarkerType } from './e-f-marker-type';
import { FComponentsStore } from '../../f-storage';

@Directive({
  selector: "svg[fMarker]",
  host: {
    class: "f-component f-marker"
  },
  providers: [ { provide: F_MARKER, useExisting: FMarkerDirective } ],
})
export class FMarkerDirective extends FMarkerBase implements OnInit, OnDestroy {

  @Input()
  public override get hostElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  @Input()
  public override width: number = 0;

  @Input()
  public override height: number = 0;

  @Input()
  public override refX: number = 0;

  @Input()
  public override refY: number = 0;

  @Input()
  public override type: string = EFMarkerType.START;

  @Input()
  public override orient: 'auto' | 'auto-start-reverse' | 'calculated' | string = 'auto';

  @Input()
  public override markerUnits: 'strokeWidth' | 'userSpaceOnUse' = 'strokeWidth';

  constructor(
    private fComponentsStore: FComponentsStore,
    private elementReference: ElementRef<HTMLElement>,
  ) {
    super();
    this.hostElement.style.display = 'none';
  }

  public ngOnInit(): void {
    this.fComponentsStore.addComponent(this.fComponentsStore.fMarkers, this);
  }

  public ngOnDestroy(): void {
    this.fComponentsStore.removeComponent(this.fComponentsStore.fMarkers, this);
  }
}
