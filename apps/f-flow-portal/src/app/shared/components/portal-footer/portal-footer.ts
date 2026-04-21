import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FBrandLinkComponent } from '@foblex/m-render';
import { IFooterColumn } from '../../models';

@Component({
  selector: 'portal-footer',
  templateUrl: './portal-footer.html',
  styleUrl: './portal-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FBrandLinkComponent],
})
export class PortalFooter {
  public readonly logo = input.required<string>();

  public readonly title = input.required<string>();

  public readonly tagline = input.required<string>();

  public readonly columns = input.required<IFooterColumn[]>();

  public readonly bottomMeta = input<string[]>([
    'Built in Warsaw, Poland since 2022.',
    'MIT licensed.',
    '© 2022–2026 Foblex.',
  ]);

  public readonly showMRenderCredit = input<boolean>(true);
}
