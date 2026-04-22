import { ChangeDetectionStrategy, Component } from '@angular/core';
import { useEmbeddedReferenceAppUrl } from './embedded-reference-app-url';

@Component({
  selector: 'schema-designer',
  standalone: true,
  template: `
    <iframe
      class="reference-app-frame"
      [src]="safeUrl"
      [attr.title]="title"
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
      allow="fullscreen"
      allowfullscreen
    ></iframe>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .reference-app-frame {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
      background: transparent;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchemaDesignerPreview {
  protected readonly title = 'Schema Designer';
  protected readonly safeUrl = useEmbeddedReferenceAppUrl('schema-designer', 4301).safeUrl;
}
