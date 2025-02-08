import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, HostListener, Injector, OnDestroy, OnInit,
} from '@angular/core';
import { FFooterNavigationButtonComponent, FFooterNavigationComponent } from './f-footer-navigation';
import { FFooterEditInformationComponent } from './f-footer-edit-information';
import { FFooterEditLinkComponent } from './f-footer-edit-information/f-footer-edit-link';
import { FFooterLastUpdatedComponent } from './f-footer-edit-information/f-footer-last-updated';
import { debounceTime, Observable, startWith, Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  HandleNavigationLinksHandler,
  HandleNavigationLinksRequest,
  IDocsFooterNavigation
} from '../../../domain';
import { GetPreviousNextPageNavigationHandler, GetPreviousNextPageNavigationRequest, IPageLink } from './domain';
import { FDocumentationEnvironmentService } from '../../f-documentation-environment.service';

@Component({
  selector: 'footer [f-markdown-footer]',
  templateUrl: './f-markdown-footer.component.html',
  styleUrls: [ './f-markdown-footer.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFooterNavigationComponent,
    FFooterNavigationButtonComponent,
    FFooterEditInformationComponent,
    FFooterEditLinkComponent,
    FFooterLastUpdatedComponent,
    RouterLink,
  ],
  standalone: true
})
export class FMarkdownFooterComponent implements OnInit, OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  protected navigation: IDocsFooterNavigation = {};

  protected editLink: string | undefined;

  protected previousLink: IPageLink | undefined;

  protected nextLink: IPageLink | undefined;

  constructor(
    private injector: Injector,
    private fEnvironmentService: FDocumentationEnvironmentService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.subscriptions$.add(this.subscribeOnRouteChanges());
  }

  private subscribeOnRouteChanges(): Subscription {
    return this.getRouterEvents().pipe(
      startWith(null), debounceTime(10)
    ).subscribe(() => this.updateData());
  }

  private getRouterEvents(): Observable<any> {
    return this.injector.get(Router).events;
  }

  private updateData(): void {
    const currentPath = this.router.url;
    const prefix = currentPath.substring(0, currentPath.lastIndexOf('/'));
    this.navigation = JSON.parse(JSON.stringify(this.fEnvironmentService.getFooterNavigation()));
    if (this.navigation.editLink) {
      this.editLink = this.getEditLink();
    }
    const previousNext = new GetPreviousNextPageNavigationHandler(this.fEnvironmentService).handle(
      new GetPreviousNextPageNavigationRequest(this.getCurrentLink())
    );
    this.previousLink = previousNext.previousLink;
    this.normalizeLink(this.previousLink, prefix);
    this.nextLink = previousNext.nextLink;
    this.normalizeLink(this.nextLink, prefix);
    this.changeDetectorRef.markForCheck();
  }

  private normalizeLink(item: IPageLink | undefined, prefix: string): void {
    if (item?.link && !this.isExternalLink(item.link)) {
      item.link = item.link.startsWith('/') ? `${ prefix }${ item.link }` : `${ prefix }/${ item.link }`;
    }
  }

  private isExternalLink(href: string): boolean {
    return href.startsWith('www') || href.startsWith('http');
  }

  private getEditLink(): string {
    return this.navigation.editLink!.pattern + this.getCurrentLink() + '.md';
  }

  private getCurrentLink(): string {
    return this.injector.get(ActivatedRoute).snapshot.url.map((x) => x.path).join('/');
  }

  @HostListener('click', [ '$event' ])
  public onDocumentClick(event: MouseEvent): void {
    this.injector.get(HandleNavigationLinksHandler).handle(new HandleNavigationLinksRequest(event));
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
