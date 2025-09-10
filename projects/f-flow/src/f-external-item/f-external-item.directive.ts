import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FExternalItemBase } from './f-external-item-base';
import { FExternalItemService } from './f-external-item.service';
import { F_EXTERNAL_ITEM } from './f-external-item-token';

let uniqueId = 0;

@Directive({
  selector: '[fExternalItem]',
  standalone: true,
  host: {
    '[attr.id]': 'fExternalItemId',
    class: 'f-component f-external-item',
    '[class.f-external-item-disabled]': 'fDisabled',
  },
  providers: [{ provide: F_EXTERNAL_ITEM, useExisting: FExternalItemDirective }],
})
export class FExternalItemDirective<TData>
  extends FExternalItemBase<TData>
  implements OnInit, OnDestroy
{
  public override hostElement = inject(ElementRef).nativeElement as HTMLElement;

  private readonly _externalItemService = inject(FExternalItemService);

  @Input()
  public override fExternalItemId: string = `f-external-item-${uniqueId++}`;

  @Input()
  public override fData: TData | undefined;

  @Input({ transform: booleanAttribute })
  public override fDisabled: boolean = false;

  @Input()
  public override fPreview: TemplateRef<unknown> | undefined;

  @Input({ transform: booleanAttribute })
  public override fPreviewMatchSize: boolean = true;

  @Input()
  public override fPlaceholder: TemplateRef<unknown> | undefined;

  public ngOnInit(): void {
    this._externalItemService.registerItem(this);
    this._disablePointerEvents(Array.from(this.hostElement.children) as HTMLElement[]);
  }

  private _disablePointerEvents(children: HTMLElement[]): void {
    children.forEach((x) => {
      x.style.pointerEvents = 'none';
      this._disablePointerEvents(Array.from(x.children) as HTMLElement[]);
    });
  }

  public ngOnDestroy(): void {
    this._externalItemService.removeItem(this);
  }
}
