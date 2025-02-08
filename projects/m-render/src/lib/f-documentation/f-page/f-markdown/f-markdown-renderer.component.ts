import {
  AfterViewChecked,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, HostListener, inject, Injector, OnDestroy, OnInit,
} from '@angular/core';
import {
  debounceTime,
  Observable,
  startWith,
  Subscription,
  switchMap
} from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';
import { FScrollableService } from '../../f-scrollable-container/f-scrollable.service';
import { catchError, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HandleDynamicComponentsHandler,
  HandleDynamicComponentsRequest,
  HandleParsedContainersHandler,
  HandleParsedContainersRequest, HighlightService,
  MarkdownService
} from './domain';
import {
  HandleNavigationLinksHandler,
  HandleNavigationLinksRequest
} from '../../../domain';
import { FMarkdownFooterComponent } from '../f-markdown-footer';
import { FDocumentationEnvironmentService } from '../../f-documentation-environment.service';

@Component({
  selector: 'f-markdown-renderer',
  templateUrl: './f-markdown-renderer.component.html',
  styleUrls: [ './f-markdown-renderer.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MarkdownService,
    HighlightService,
    HandleNavigationLinksHandler,
    HandleParsedContainersHandler,
    HandleDynamicComponentsHandler
  ],
  imports: [
    FMarkdownFooterComponent
  ],
  host: {
    class: 'm-render'
  }
})
export class FMarkdownRendererComponent implements OnInit, AfterViewChecked, OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  protected value: SafeHtml | undefined;

  private hostElement = inject(ElementRef).nativeElement;

  private fScrollableService = inject(FScrollableService);
  private fContainersHandler = inject(HandleParsedContainersHandler);
  private fDynamicComponentsHandler = inject(HandleDynamicComponentsHandler);

  private isMarkdownChanged: boolean = false;

  constructor(
    private injector: Injector,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.subscriptions$.add(this.subscribeOnRouteChanges());
  }

  private subscribeOnRouteChanges(): Subscription {
    return this.getRouterEvents().pipe(
      startWith(null), debounceTime(50),
      switchMap(() => this.injector.get(MarkdownService).parse(
        this.injector.get(FDocumentationEnvironmentService).getMarkdownUrl(this.markdownPath)
      )),
      tap((x) => this.renderMarkdown(x)),
      catchError((e, data) => data)
    ).subscribe();
  }

  private getRouterEvents(): Observable<any> {
    return this.injector.get(Router).events;
  }

  private get markdownPath(): string {
    return this.injector.get(ActivatedRoute).snapshot.url.map((x) => x.path).join('/');
  }

  private renderMarkdown(value: SafeHtml): void {
    this.value = value;
    this.isMarkdownChanged = true;
    this.changeDetectorRef.markForCheck();
  }

  public ngAfterViewChecked(): void {
    if (this.isMarkdownChanged) {
      this.isMarkdownChanged = false;
      this.fScrollableService.setOnPageNavigation(this.hostElement);
      this.fContainersHandler.handle(new HandleParsedContainersRequest(this.hostElement));
      this.fDynamicComponentsHandler.handle(new HandleDynamicComponentsRequest(this.hostElement));
    }
  }

  @HostListener('click', [ '$event' ])
  public onDocumentClick(event: MouseEvent): void {
    this.injector.get(HandleNavigationLinksHandler).handle(new HandleNavigationLinksRequest(event));
  }

  public ngOnDestroy(): void {
    this.fContainersHandler.dispose();
    this.fDynamicComponentsHandler.dispose();
    this.subscriptions$.unsubscribe();
  }
}

