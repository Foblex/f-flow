import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

@Component({
  selector: 'nav[f-footer-navigation]',
  templateUrl: './f-footer-navigation.component.html',
  styleUrls: [ './f-footer-navigation.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class FFooterNavigationComponent {

}
