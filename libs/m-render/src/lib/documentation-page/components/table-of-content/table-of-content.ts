import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  untracked,
} from '@angular/core';
import { TableOfContentItemsComponent } from './table-of-content-items';
import { DocumentationStore } from '../../services';
import { WINDOW } from '../../../common';
import { Mediatr } from '../../../mediatr';
import { ActivateTocByHashRequest, ScrollToElementInContainerRequest } from './features';

@Component({
  selector: 'table-of-content',
  styleUrls: ['./table-of-content.scss'],
  templateUrl: './table-of-content.html',
  standalone: true,
  imports: [TableOfContentItemsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOfContent {

  private readonly _hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly _dataProvider = inject(DocumentationStore);
  private readonly _window = inject(WINDOW);
  private readonly _mediatr = inject(Mediatr);

  protected readonly tocData = computed(() => this._dataProvider.tocData());

  protected readonly activeMarkerPosition = computed(() => {
    const index = this.tocData()?.flat.findIndex((x) => x.isActive) || 0;
    return untracked(() => this._getActiveMarkerPosition(index));
  });
  protected readonly title = inject(DocumentationStore).getTableOfContent()!.title;

  private _getActiveMarkerPosition(activeIndex: number): number {
    const itemHeight = this._getToCItemHeight(this._hostElement);
    return (activeIndex + 1) * itemHeight + itemHeight / 4;
  }

  private _getToCItemHeight(element: HTMLElement): number {
    return parseInt(this._window.getComputedStyle(element).getPropertyValue('--on-page-navigation-item-height'));
  }

  @HostListener('click', ['$event'])
  protected _click(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      event.preventDefault();
      this._scrollTo(target.getAttribute('href')!);
    }
  }

  private _scrollTo(hash: string): void {
    this._mediatr.execute(new ActivateTocByHashRequest(hash));
    this._mediatr.execute(new ScrollToElementInContainerRequest(hash));
  }
}
