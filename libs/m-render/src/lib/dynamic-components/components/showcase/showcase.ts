import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FRadioButtonComponent } from '../../../shared';
import { ShowcaseItem } from './components';
import { SHOWCASE_DATA } from './showcase-token';
import { IShowcaseItem } from './models';

let filterGroupUniqueId = 0;

@Component({
  selector: 'showcase',
  templateUrl: './showcase.html',
  styleUrls: [ './showcase.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FRadioButtonComponent,
    ShowcaseItem,
  ],
})
export class Showcase{
  private readonly _data = signal<IShowcaseItem[]>(inject(SHOWCASE_DATA));
  private readonly _allFilterLabel = 'All';
  protected readonly filterGroupName = `showcase-filters-${ filterGroupUniqueId++ }`;

  protected readonly items = computed(() => {
    const items = this._data();
    const activeTag = this.activeTag();
    return activeTag ? items.filter(item => item.tags?.includes(activeTag)) : items;
  });

  protected readonly filterOptions = computed(() => [{
    label: this._allFilterLabel,
    value: null,
  }, ...Array.from(this._data().reduce((result, item) => {
    item.tags?.forEach(tag => result.add(tag));
    return result;
  }, new Set<string>()))
    .sort((a, b) => a.localeCompare(b))
    .map((tag) => ({
      label: tag,
      value: tag,
    }))]);

  protected readonly activeTag = signal<string | null>(null);

  protected onFilterChange(tag: string | null): void {
    this.activeTag.set(tag);
  }
}
