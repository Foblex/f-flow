import {
  ChangeDetectionStrategy,
  Component, inject
} from '@angular/core';
import {
  FThemeButtonComponent,
} from '../../common-components';
import { FDocumentationEnvironmentService } from '../f-documentation-environment.service';
import { FHamburgerButtonComponent } from '../f-hamburger-button/f-hamburger-button.component';
import { FSocialLinksComponent } from '../f-social-links/f-social-links.component';
import { FHeaderMenuComponent } from '../f-header-menu/f-header-menu.component';
import { FVersionComponent } from '../f-version/f-version.component';

@Component({
  selector: 'f-header',
  templateUrl: './f-header.component.html',
  styleUrls: [ './f-header.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FHamburgerButtonComponent,
    FVersionComponent,
    FSocialLinksComponent,
    FThemeButtonComponent,
    FHeaderMenuComponent
  ]
})
export class FHeaderComponent {

  protected title: string = inject(FDocumentationEnvironmentService).getTitle();
}
