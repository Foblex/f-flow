import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'hero-node-connector',
  styleUrls: ['./hero-node-connector.scss'],
  templateUrl: './hero-node-connector.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'position()',
  },
})
export class HeroNodeConnector {
  public readonly position = input.required<'left' | 'top' | 'right' | 'bottom' | 'fill'>();
}
