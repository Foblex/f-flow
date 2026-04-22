import {
  ChangeDetectionStrategy,
  Component, Input,
} from '@angular/core';
import { IMarkdownFooterLink } from '../domain';

@Component({
  selector: 'a[footer-navigation-button]',
  templateUrl: './footer-navigation-button.html',
  styleUrls: [ './footer-navigation-button.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FooterNavigationButton {

  @Input({ required: true })
  public description: string | undefined;

  @Input({ required: true })
  public link!: IMarkdownFooterLink;
}
