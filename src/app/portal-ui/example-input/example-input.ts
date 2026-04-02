import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';

@Component({
  selector: 'example-input',
  templateUrl: 'example-input.html',
  styleUrl: './example-input.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleInput {
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
