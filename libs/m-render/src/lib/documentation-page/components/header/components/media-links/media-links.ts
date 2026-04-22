import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MEDIA_LINKS_PROVIDER } from './domain';

@Component({
  selector: 'media-links',
  templateUrl: './media-links.html',
  styleUrls: [ './media-links.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaLinks {

  protected links = inject(MEDIA_LINKS_PROVIDER, { optional: true });
}
