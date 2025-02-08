import {
  ChangeDetectionStrategy,
  Component, Input
} from '@angular/core';
import { ITableOfContentItem } from '../../../f-scrollable-container';

@Component({
  selector: 'ul[f-table-of-content-items]',
  styleUrls: [ './f-table-of-content-items.component.scss' ],
  templateUrl: './f-table-of-content-items.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true
})
export class FTableOfContentItemsComponent {

  @Input()
  public items: ITableOfContentItem[] = [];
}
