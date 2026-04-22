import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'service-node-connector',
  styleUrls: ['./service-node-connector.scss'],
  templateUrl: './service-node-connector.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'position()',
  },
})
export class ServiceNodeConnector {
  public readonly position = input.required<'left' | 'top' | 'right' | 'bottom' | 'fill'>();
}
