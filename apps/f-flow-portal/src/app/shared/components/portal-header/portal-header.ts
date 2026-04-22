import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FBrandLinkComponent, ThemeButtonComponent } from '@foblex/m-render';

@Component({
  selector: 'portal-header',
  templateUrl: './portal-header.html',
  styleUrl: './portal-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FBrandLinkComponent, ThemeButtonComponent],
})
export class PortalHeader {
  public readonly logo = input.required<string>();

  public readonly title = input.required<string>();

  public readonly currentPage = input<'home' | 'services'>('home');
}
