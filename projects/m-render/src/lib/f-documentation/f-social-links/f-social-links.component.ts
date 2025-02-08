import {
  ChangeDetectionStrategy,
  Component, inject
} from '@angular/core';
import { FDocumentationEnvironmentService } from '../f-documentation-environment.service';

@Component({
  selector: 'f-social-links',
  templateUrl: './f-social-links.component.html',
  styleUrls: [ './f-social-links.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FSocialLinksComponent {

  protected links = inject(FDocumentationEnvironmentService).getSocialLinks();
}
