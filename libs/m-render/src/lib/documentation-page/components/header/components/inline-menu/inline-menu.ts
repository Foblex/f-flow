import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderMenuBase } from '../../models';

@Component({
  selector: 'inline-menu',
  templateUrl: './inline-menu.html',
  styleUrls: [ './inline-menu.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
  ],
})
export class InlineMenu extends HeaderMenuBase {
}

