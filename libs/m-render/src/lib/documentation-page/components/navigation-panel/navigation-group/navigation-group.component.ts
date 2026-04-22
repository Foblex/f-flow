import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'f-navigation-group',
  templateUrl: './navigation-group.component.html',
  styleUrls: [ './navigation-group.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.collapsed]': 'isCollapsed()',
    '[class.no-title]': '!title()',
  },
})
export class NavigationGroupComponent {
  public readonly title = input<string | undefined>(undefined);

  protected readonly isCollapsed = signal(false);

  protected toggle(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }
}
