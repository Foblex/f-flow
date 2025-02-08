import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FStateService } from '../../domain/f-state.service';
import { Router } from '@angular/router';
import { FDocumentationEnvironmentService } from '../f-documentation-environment.service';
import { IKeyValue } from '../../domain/i-key-value';

@Component({
  selector: 'div[f-preview-group-filters]',
  templateUrl: './f-preview-group-filters.component.html',
  styleUrls: [ './f-preview-group-filters.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FPreviewGroupFiltersComponent {

  private _fEnvironment = inject(FDocumentationEnvironmentService);

  protected filters = signal<IKeyValue[]>([]);
  protected activeFilter = signal<IKeyValue | null>(null);

  public initialize(): void {
    this._calculateFilters();
  }

  private _calculateFilters(): void {
    this.filters.set(this._mapFilter(this._calculateFiltersMap()));
  }

  private _calculateFiltersMap(): { [ key: string ]: string } {
    const filters: { [ key: string ]: string } = {};
    this._fEnvironment.getNavigation().forEach((group) => {
      group.items.forEach((item) => {
        if (item.badge) {
          filters[ item.badge.type ] = item.badge.text;
        }
      });
    });
    return filters;
  }

  private _mapFilter(filters: { [ key: string ]: string }): IKeyValue[] {
    return Object.keys(filters)
      .map((key) => ({ key, value: filters[ key ] }));
  }

  protected onFilterClick(filter: IKeyValue): void {
    this.activeFilter.set(filter);
  }
}
