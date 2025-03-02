import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef
} from '@angular/core';
import { FExternalItemBase } from './f-external-item-base';
import { FExternalItemService } from './f-external-item.service';
import { F_EXTERNAL_ITEM } from './f-external-item-token';

let uniqueId: number = 0;

@Directive({
  selector: "[fExternalItem]",
  standalone: true,
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

  private readonly _elementReference = inject(ElementRef);
  private readonly _fExternalItemService = inject(FExternalItemService);

  @Input()
  public override fExternalItemId: string = `f-external-item-${ uniqueId++ }`;

  public override get hostElement(): HTMLElement | SVGElement {
    return this._elementReference.nativeElement;
  }

  @Input()
  public override fData: TData | undefined;

  @Input({ transform: booleanAttribute })
  public override fDisabled: boolean = false;

  @Input()
  public override fPreview: TemplateRef<any> | undefined;

  @Input({ transform: booleanAttribute })
  public override fPreviewMatchSize: boolean = true;

  @Input()
  public override fPlaceholder: TemplateRef<any> | undefined;

  public ngOnInit(): void {
    this._fExternalItemService.registerItem(this);
    this.disablePointerEvents(Array.from(this.hostElement.children) as HTMLElement[]);
  }

  private disablePointerEvents(children: HTMLElement[]): void {
    children.forEach((x) => {
      x.style.pointerEvents = 'none';
      this.disablePointerEvents(Array.from(x.children) as HTMLElement[]);
    });
  }

  public ngOnDestroy(): void {
    this._fExternalItemService.removeItem(this);
  }
}
