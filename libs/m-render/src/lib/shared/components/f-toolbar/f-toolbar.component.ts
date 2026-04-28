import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'f-toolbar',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './f-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-drag-blocker f-toolbar-chrome-bar',
  },
})
export class FToolbarComponent {}
