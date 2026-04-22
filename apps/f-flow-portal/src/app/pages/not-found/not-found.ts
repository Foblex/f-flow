import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class NotFound implements OnInit {
  private readonly _seo = inject(Seo);

  public ngOnInit(): void {
    this._seo.apply({
      title: '404 - Page Not Found | Foblex Flow',
      description:
        'The requested Foblex Flow page could not be found. Continue with the docs, examples, showcase, or articles.',
      canonicalUrl: 'https://flow.foblex.com/404',
      robots: 'noindex, nofollow, noarchive',
    });
  }
}
