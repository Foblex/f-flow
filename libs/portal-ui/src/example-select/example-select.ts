import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { KeyValue } from '@angular/common';

type Options<T> = T[] | KeyValue<T, unknown>[];

@Component({
  selector: 'example-select',
  templateUrl: 'example-select.html',
  styleUrl: './example-select.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleSelect<T> {
  public readonly label = input<string | undefined>();
  public readonly value = model<T | undefined | null>(undefined);
  public readonly options = input<KeyValue<T, unknown>[], Options<T>>([], {
    transform: (value: T[] | Options<T>) => {
      if (this._isKeyValueArray(value)) {
        return value as KeyValue<T, unknown>[];
      }

      return value.map((option) => ({ key: option, value: String(option) }));
    },
  });

  private _isKeyValueArray(value: T[] | KeyValue<T, unknown>[]): value is KeyValue<T, unknown>[] {
    const firstItem = value[0];

    return (
      value.length > 0 &&
      typeof firstItem === 'object' &&
      firstItem !== null &&
      'key' in firstItem &&
      'value' in firstItem
    );
  }

  protected change(event: Event): void {
    this.value.set(this._read(event));
  }

  protected valueAsString(): string {
    return this._stringify(this.value());
  }

  protected isSelected(value: T): boolean {
    return this._stringify(value) === this.valueAsString();
  }

  private _read(event: Event): T | undefined {
    const value = (event.target as HTMLSelectElement).value;
    const option = this.options().find((option) => String(option.key) === value);

    return option ? option.key : undefined;
  }

  private _stringify(value: T | undefined | null): string {
    return value === undefined || value === null ? '' : String(value);
  }
}
