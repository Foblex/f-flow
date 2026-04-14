import { ChangeDetectionStrategy, Component } from '@angular/core';
import { useEmbeddedReferenceAppUrl } from './embedded-reference-app-url';

@Component({
  selector: 'call-center',
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
export class CallCenterPreview {
  protected readonly title = 'Call Center Flow';
  protected readonly safeUrl = useEmbeddedReferenceAppUrl('call-center', 4305).safeUrl;
}
