import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type FToolbarAlign = 'start' | 'end';

@Component({
  selector: 'f-toolbar',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './f-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.f-toolbar-start]': 'align() === "start"',
    '[class.f-toolbar-end]': 'align() === "end"',
  },
})
export class FToolbarComponent {
  public readonly align = input<FToolbarAlign>('end');
}
