import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type FOverlaySide = 'start' | 'end';

@Component({
  selector: 'f-overlay',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './f-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.f-overlay-start]': 'side() === "start"',
    '[class.f-overlay-end]': 'side() === "end"',
  },
})
export class FOverlayComponent {
  public readonly side = input<FOverlaySide>('end');
}
