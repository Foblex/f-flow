import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type JsonLdGraph = Record<string, unknown> | readonly Record<string, unknown>[];

/**
 * Injects one `<script type="application/ld+json" data-ld-id="…">` per
 * logical block into the document head. Re-calling with the same id
 * replaces the existing block so route changes don't stack schema.
 *
 * Pages call this from ngOnInit with their schema.org payload — home
 * declares SoftwareApplication + Organization, services declares the
 * three engagement Services + FAQPage, and so on.
 */
@Injectable({ providedIn: 'root' })
export class StructuredData {
  private readonly _document = inject(DOCUMENT);

  public set(id: string, graph: JsonLdGraph): void {
    const attr = `data-ld-id="${id}"`;
    const existing = this._document.head.querySelector(
      `script[type="application/ld+json"][${attr}]`,
    );

    const script = existing ?? this._document.createElement('script');
    if (!existing) {
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-ld-id', id);
      this._document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(graph);
  }
}
