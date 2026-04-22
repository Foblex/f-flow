import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DocumentationStore } from '../../../../../documentation-page';
import { TitleCasePipe } from '@angular/common';
import { FCheckboxComponent, FRadioButtonComponent } from '../../../../../shared';
import { PreviewGroupService } from '../../preview-group.service';

let previewFilterGroupUniqueId = 0;

@Component({
  selector: 'div[preview-action-bar]',
  templateUrl: './preview-action-bar.html',
  styleUrls: [ './preview-action-bar.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FCheckboxComponent,
    FRadioButtonComponent,
    TitleCasePipe,
  ],
})
export class PreviewActionBar implements AfterViewInit {

  private readonly _allKey = 'all';

  private _fEnvironment = inject(DocumentationStore);
  private _fPreviewGroupService = inject(PreviewGroupService);

  protected readonly filterGroupName = `preview-filters-${ previewFilterGroupUniqueId++ }`;
  protected filters = signal<string[]>([]);
  protected activeFilter = signal<string>(this._allKey);

  protected isSortByDateChecked = signal<boolean>(false);

  public initialize(): void {
    this.filters.set(this._calculateFiltersMap());
  }

  public ngAfterViewInit(): void {
    this.onFilterChange(this._allKey);
  }

  private _calculateFiltersMap(): string[] {
    const filters: string[] = [];
    this._fEnvironment.getNavigation().forEach((group) => {
      group.items.forEach((item) => {
        if (item.badge && !filters.includes(item.badge.text.toLowerCase())) {
          filters.push(item.badge.text.toLowerCase());
        }
      });
    });
    if (filters.length > 0) {
      filters.unshift(this._allKey);
    }
    return filters[0] === this._allKey
      ? [ this._allKey, ...filters.slice(1).sort((a, b) => a.localeCompare(b)) ]
      : filters.sort((a, b) => a.localeCompare(b));
  }

  protected onFilterChange(key: string): void {
    this.activeFilter.set(key);
    this._fPreviewGroupService.filterBy(key, this._allKey);
  }

  protected onSortByDateChange(event: boolean): void {
    this.isSortByDateChecked.set(event);
    this._fPreviewGroupService.sortByDate(event);
  }
}
