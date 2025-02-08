import {
  ChangeDetectionStrategy,
  Component, HostListener, Inject
} from '@angular/core';
import { F_DOCUMENTATION_COMPONENT, IDocumentationComponent } from '../index';

@Component({
  selector: 'button[f-hamburger-button]',
  templateUrl: './f-hamburger-button.component.html',
  styleUrls: [ './f-hamburger-button.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FHamburgerButtonComponent {

  constructor(
    @Inject(F_DOCUMENTATION_COMPONENT) private fDocumentation: IDocumentationComponent
  ) {
  }

  @HostListener('click')
  public onShowNavigation(): void {
    this.fDocumentation.onToggleNavigation(true);
  }
}
