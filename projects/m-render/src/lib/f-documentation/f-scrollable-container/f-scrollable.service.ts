import { Injectable } from '@angular/core';
import {
  GetTableOfContentDataHandler, GetTableOfContentDataRequest,
  ScrollToElementInContainer,
  CalculateHashFromScrollPositionHandler,
  CalculateHashFromScrollPositionRequest, TableOfContentData
} from './domain';
import { debounceTime, fromEvent, map, Observable, Subject, Subscription } from 'rxjs';
import { BrowserService } from '@foblex/platform';
import { FDocumentationEnvironmentService } from '../f-documentation-environment.service';

@Injectable()
export class FScrollableService {

  private fScrollableContainer!: HTMLElement;

  private tocData: TableOfContentData = new TableOfContentData([], []);

  private onTocChanged$: Subject<void> = new Subject<void>();

  public get onToc$(): Observable<TableOfContentData> {
    return this.onTocChanged$.asObservable().pipe(map(() => this.tocData));
  }

  private onScrollSubscription$: Subscription = Subscription.EMPTY;

  constructor(
    private fEnvironmentService: FDocumentationEnvironmentService,
    private fBrowser: BrowserService,
  ) {
  }

  public setContainer(fScrollableContainer: HTMLElement): void {
    this.fScrollableContainer = fScrollableContainer;
    this.onScrollSubscription$ = this.subscribeOnScroll();
  }

  private subscribeOnScroll(): Subscription {
    return fromEvent(this.fScrollableContainer, 'scroll').pipe(debounceTime(100)).subscribe((event) => {
      this.calculateHashAndActivate();
    });
  }

  public scrollTo(hash: string): void {
    if (!this.fScrollableContainer) {
      throw new Error('Scrollable container is not set');
    }
    this.activateHash(hash);
    new ScrollToElementInContainer(this.fScrollableContainer).handle(hash);
  }

  public setOnPageNavigation(fMarkdownPage: HTMLElement): void {
    this.tocData = new GetTableOfContentDataHandler().handle(
      new GetTableOfContentDataRequest(fMarkdownPage, this.fEnvironmentService.getToC().range)
    );
    this.calculateHashAndActivate();
  }

  private calculateHashAndActivate(): void {
    this.activateHash(this.calculateHashFromScrollPosition());
  }

  private calculateHashFromScrollPosition(): string | undefined {
    return new CalculateHashFromScrollPositionHandler(this.fScrollableContainer, this.fBrowser).handle(
      new CalculateHashFromScrollPositionRequest(this.tocData.flat)
    );
  }

  private activateHash(hash: string | undefined): void {
    this.tocData.flat.forEach(x => x.isActive = x.hash === hash);
    this.onTocChanged$.next();
  }

  public dispose(): void {
    this.onScrollSubscription$.unsubscribe();
  }
}
