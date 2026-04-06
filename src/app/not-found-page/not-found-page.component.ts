import { DOCUMENT } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
  standalone: true,
  imports: [RouterLink],
})
export class NotFoundPageComponent implements OnInit {
  private readonly _title = inject(Title);
  private readonly _meta = inject(Meta);
  private readonly _document = inject(DOCUMENT);
  private readonly _canonicalUrl = 'https://flow.foblex.com/404';

  public ngOnInit(): void {
    const title = '404 - Page Not Found | Foblex Flow';
    const description =
      'The requested Foblex Flow page could not be found. Continue with the docs, examples, showcase, or articles.';

    this._title.setTitle(title);
    this._meta.updateTag({ name: 'description', content: description });
    this._meta.updateTag({ name: 'robots', content: 'noindex, nofollow, noarchive' });
    this._meta.updateTag({ property: 'og:title', content: title });
    this._meta.updateTag({ property: 'og:description', content: description });
    this._meta.updateTag({ property: 'og:url', content: this._canonicalUrl });
    this._meta.updateTag({ name: 'twitter:title', content: title });
    this._meta.updateTag({ name: 'twitter:description', content: description });
    this._setCanonical(this._canonicalUrl);
  }

  private _setCanonical(url: string): void {
    let canonicalLink = this._document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonicalLink) {
      canonicalLink = this._document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this._document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);
  }
}
