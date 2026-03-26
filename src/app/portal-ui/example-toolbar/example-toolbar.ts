import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type ExampleToolbarAlign = 'start' | 'end';

@Component({
  selector: 'example-toolbar, ff-example-toolbar',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './example-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-toolbar-start]': 'align() === "start"',
    '[class.example-toolbar-end]': 'align() === "end"',
  },
})
export class ExampleToolbar {
  public readonly align = input<ExampleToolbarAlign>('end');
}
