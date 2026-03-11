import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FConnectionGradientRendererBase } from './models';
import { FConnectionGradientBase } from '../../models';

@Component({
  selector: 'linearGradient[fConnectionGradientRenderer]',
  templateUrl: './f-connection-gradient-renderer.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'gradientId()',
  },
})
export class FConnectionGradientRenderer extends FConnectionGradientRendererBase {
  public override readonly gradient = input.required<FConnectionGradientBase>({
    alias: 'fConnectionGradientRendererFor',
  });
}
