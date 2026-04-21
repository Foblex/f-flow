import {
  ChangeDetectionStrategy,
  Component, ElementRef, HostListener, input, output, viewChild,
} from '@angular/core';

let uniqueId = 0;

@Component({
  selector: 'f-radio-button',
  templateUrl: './f-radio-button.component.html',
  styleUrls: [ './f-radio-button.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.f-radio-button-checked]': 'checked()',
  },
})
export class FRadioButtonComponent {

  public id = input<string>(`f-radio-button-${ uniqueId++ }`);
  public name = input<string | null>(null);

  public change = output<boolean>();
  public checked = input<boolean>(false);

  protected labelElement = viewChild<ElementRef>('label');

  public onInputClick(): void {
    this._handleInputClick();
  }

  public onTouchTargetClick(): void {
    this._handleInputClick();
  }

  private _handleInputClick(): void {
    this._emitChangeEvent();
  }

  private _emitChangeEvent(): void {
    this.change.emit(true);
  }

  protected onInteractionEvent(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('click', [ '$event' ])
  protected preventBubblingFromLabel(event: MouseEvent): void {
    if (!!event.target && this.labelElement()?.nativeElement.contains(event.target as HTMLElement)) {
      event.stopPropagation();
    }
  }
}
