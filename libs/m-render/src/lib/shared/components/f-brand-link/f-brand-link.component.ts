import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'f-brand-link',
  templateUrl: './f-brand-link.component.html',
  styleUrls: [ './f-brand-link.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ RouterLink ],
})
export class FBrandLinkComponent {
  public readonly title = input.required<string>();
  public readonly logo = input.required<string>();
  public readonly ariaLabel = input<string>('Home');
  public readonly logoAlt = input<string>('logo');
  public readonly href = input<string>('');
  public readonly routerLink = input<string | unknown[] | null>(null);
}
