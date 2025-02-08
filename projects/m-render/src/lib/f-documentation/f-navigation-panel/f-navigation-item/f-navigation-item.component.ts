import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'a[f-navigation-item]',
  templateUrl: './f-navigation-item.component.html',
  styleUrls: [ './f-navigation-item.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FNavigationItemComponent {

}
