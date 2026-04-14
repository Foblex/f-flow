import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type ExampleOverlaySide = 'start' | 'end';

@Component({
  selector: 'example-overlay',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './example-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-overlay-start]': 'side() === "start"',
    '[class.example-overlay-end]': 'side() === "end"',
  },
})
export class ExampleOverlay {
  public readonly side = input<ExampleOverlaySide>('end');
}
