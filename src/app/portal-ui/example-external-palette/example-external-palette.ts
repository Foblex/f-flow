import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'example-external-palette',
  standalone: true,
  templateUrl: './example-external-palette.html',
  styleUrls: ['./example-external-palette.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleExternalPalette {
  public description = input('');
}
