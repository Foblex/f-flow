import {
  ChangeDetectionStrategy,
  Component, Input
} from '@angular/core';

@Component({
  selector: 'span[f-badge]',
  templateUrl: './f-badge.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'f-badge',
    '[class]': 'type',
  }
})
export class FBadgeComponent {

  @Input()
  public text: string = '';

  @Input()
  public type: 'success' | 'danger' | 'warning' | 'info' | 'tip' = 'tip';
}
