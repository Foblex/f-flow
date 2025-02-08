import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FTableOfContentComponent } from './f-table-of-content';
import { FMarkdownRendererComponent } from './f-markdown';

@Component({
  selector: 'f-page',
  templateUrl: './f-page.component.html',
  styleUrls: [ './f-page.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FTableOfContentComponent,
    FMarkdownRendererComponent
  ],
  host: {
    'ngSkipHydration': ''
  }
})
export class FPageComponent {

}
