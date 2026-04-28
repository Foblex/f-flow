import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'f-external-palette',
  standalone: true,
  templateUrl: './f-external-palette.component.html',
  styleUrls: ['./f-external-palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FExternalPaletteComponent {
  public description = input('');
}
