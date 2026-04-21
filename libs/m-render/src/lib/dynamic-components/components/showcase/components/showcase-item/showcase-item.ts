import {
  ChangeDetectionStrategy,
  Component, computed,
  inject, input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { IShowcaseItem } from '../../models';
import { ThemeService } from '../../../../../theme';

@Component({
  selector: 'showcase-item',
  templateUrl: './showcase-item.html',
  styleUrls: [ './showcase-item.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseItem {
  private readonly _themeService = inject(ThemeService);

  private readonly _themeChanges = toSignal(this._themeService.theme$.pipe(startWith(null), map(() => this._themeService.getPreferredTheme())));
  public readonly model = input.required<IShowcaseItem>();

  protected readonly src = computed(() => {
    const theme = this._themeChanges();
    const model = this.model();
    return theme === 'dark' ? (model.imageUrlDark || model.imageUrl) : model.imageUrl;
  });
}
