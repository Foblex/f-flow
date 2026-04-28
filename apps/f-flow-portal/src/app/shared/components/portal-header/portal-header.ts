import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FBrandLinkComponent, ThemeButtonComponent } from '@foblex/m-render';
import { SearchService } from '../../search';

@Component({
  selector: 'portal-header',
  templateUrl: './portal-header.html',
  styleUrl: './portal-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FBrandLinkComponent, ThemeButtonComponent],
})
export class PortalHeader {
  private readonly _search = inject(SearchService);

  public readonly logo = input.required<string>();

  public readonly title = input.required<string>();

  public readonly currentPage = input<'home' | 'services'>('home');

  protected openSearch(): void {
    this._search.open();
  }
}
