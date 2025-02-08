import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

@Component({
  selector: 'a[f-footer-edit-link]',
  templateUrl: './f-footer-edit-link.component.html',
  styleUrls: [ './f-footer-edit-link.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class FFooterEditLinkComponent {

}
