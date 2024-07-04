import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { FExternalItemBase, F_EXTERNAL_ITEM } from './f-external-item-base';
import { FExternalItemService } from './f-external-item.service';

let uniqueId: number = 0;

@Directive({
  selector: "[fExternalItem]",
  host: {
    '[attr.id]': 'fExternalItemId',
    class: "f-component f-external-item",
    '[class.f-external-item-disabled]': 'fDisabled',
  },
  providers: [
    { provide: F_EXTERNAL_ITEM, useExisting: FExternalItemDirective }
  ],
})
export class FExternalItemDirective<TData> extends FExternalItemBase<TData> implements OnInit, OnDestroy {

  @Input()
  public override fExternalItemId: string = `f-external-item-${ uniqueId++ }`;

  public override get hostElement(): HTMLElement | SVGElement {
    return this.elementReference.nativeElement;
  }

  @Input()
  public override fData: TData | undefined;

  @Input()
  public override fDisabled: boolean = false;

  constructor(
    private elementReference: ElementRef<HTMLElement>,
    private fExternalItemService: FExternalItemService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.fExternalItemService.registerItem(this);
  }

  public ngOnDestroy(): void {
    this.fExternalItemService.removeItem(this);
  }
}
