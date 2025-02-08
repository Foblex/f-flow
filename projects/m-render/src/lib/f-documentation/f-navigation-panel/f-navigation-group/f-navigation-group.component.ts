import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'f-navigation-group',
  templateUrl: './f-navigation-group.component.html',
  styleUrls: [ './f-navigation-group.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.collapsed]': 'isCollapsed',
    '[class.no-title]': '!title'
  }
})
export class FNavigationGroupComponent {

  @Input()
  public title: string | undefined;

  public isCollapsed: boolean = false;

  public toggle(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
