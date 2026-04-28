import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'f-input',
  templateUrl: './f-input.component.html',
  styleUrl: './f-input.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FInputComponent {
  public readonly label = input<string | undefined>();
  public readonly value = model<number>(0);

  protected change(event: Event): void {
    this.value.set(this._read(event, 1, 1));
  }

  private _read(event: Event, fallback: number, min: number): number {
    const value = Number((event.target as HTMLInputElement).value);
    if (!Number.isFinite(value)) {
      return fallback;
    }

    return Math.max(min, value);
  }
}
