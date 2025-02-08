import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FScrollableService } from '../../f-scrollable-container/f-scrollable.service';
import { TableOfContentData } from '../../f-scrollable-container';
import { FTableOfContentItemsComponent } from './f-table-of-content-items';
import { BrowserService } from '@foblex/platform';
import { FDocumentationEnvironmentService } from '../../f-documentation-environment.service';

@Component({
  selector: 'aside[f-table-of-content]',
  styleUrls: [ './f-table-of-content.component.scss' ],
  templateUrl: './f-table-of-content.component.html',
  standalone: true,
  imports: [ AsyncPipe, JsonPipe, FTableOfContentItemsComponent ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FTableOfContentComponent implements OnInit, OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  public get onToc$(): Observable<TableOfContentData> {
    return this.fScrollableService.onToc$;
  }

  protected tocData: TableOfContentData = new TableOfContentData([], []);

  protected activeMarkerPosition: number = 0;

  protected title: string | undefined;

  constructor(
    private fEnvironmentService: FDocumentationEnvironmentService,
    private elementRef: ElementRef<HTMLElement>,
    private fScrollableService: FScrollableService,
    private changeDetectorRef: ChangeDetectorRef,
    private fBrowser: BrowserService
  ) {
    this.title = this.fEnvironmentService.getToC().title;
  }

  public ngOnInit(): void {
    this.subscriptions$.add(this.subscribeOnPageNavigation());
  }

  private subscribeOnPageNavigation(): Subscription {
    return this.onToc$.subscribe((data) => {
      this.tocData = data;
      this.activeMarkerPosition = this.getActiveMarkerPosition();
      this.changeDetectorRef.detectChanges();
    });
  }

  private getActiveMarkerPosition(): number {
    const index = this.tocData.flat.findIndex((x) => x.isActive) || 0;
    const itemHeight = parseInt(this.getComputedStyle(this.elementRef.nativeElement).getPropertyValue('--on-page-navigation-item-height'));
    return (index + 1) * itemHeight + itemHeight / 4;
  }

  private getComputedStyle(element: HTMLElement): CSSStyleDeclaration {
    return this.fBrowser.window.getComputedStyle(element);
  }

  @HostListener('click', [ '$event' ])
  public onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      event.preventDefault();
      this.fScrollableService.scrollTo(target.getAttribute('href')!);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
