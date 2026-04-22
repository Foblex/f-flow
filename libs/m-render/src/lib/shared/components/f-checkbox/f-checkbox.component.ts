import {
  booleanAttribute,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild,
} from '@angular/core';

let uniqueId = 0;

@Component({
  selector: 'f-checkbox',
  templateUrl: './f-checkbox.component.html',
  styleUrls: [ './f-checkbox.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.f-checkbox-checked]': 'checked',
  },
})
export class FCheckboxComponent {

  @Input()
  public id = `f-checkbox-${ uniqueId++ }`;

  @Output()
  public change: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('input')
  private inputElement?: ElementRef<HTMLInputElement>;

  @ViewChild('label')
  public labelElement?: ElementRef<HTMLLabelElement>;

  @Input({ transform: booleanAttribute })
  public get checked(): boolean {
    return this.isChecked;
  }

  public set checked(value: boolean) {
    if (value != this.checked) {
      this.isChecked = value;
      this.changeDetectorRef.markForCheck();
    }
  }

  private isChecked = false;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public onInputClick(): void {
    this.handleInputClick();
  }

  public onTouchTargetClick(): void {
    this.handleInputClick();
    this.inputElement?.nativeElement.focus();
  }

  private handleInputClick(): void {
    this.isChecked = !this.isChecked;
    this.emitChangeEvent();
  }

  private emitChangeEvent(): void {
    this.change.emit(this.isChecked);
    if (this.inputElement) {
      this.inputElement.nativeElement.checked = this.isChecked;
    }
  }

  public onInteractionEvent(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('click', [ '$event' ])
  public preventBubblingFromLabel(event: MouseEvent): void {
    if (!!event.target && this.labelElement?.nativeElement.contains(event.target as HTMLElement)) {
      event.stopPropagation();
    }
  }
}
