import {
  ChangeDetectionStrategy,
  Component, Input,
} from '@angular/core';
import { IPageLink } from '../../domain';

@Component({
  selector: 'a[f-footer-navigation-button]',
  templateUrl: './f-footer-navigation-button.component.html',
  styleUrls: [ './f-footer-navigation-button.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class FFooterNavigationButtonComponent {

  @Input({ required: true })
  public description: string | undefined;

  @Input({ required: true })
  public link!: IPageLink;
}
