import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, HostListener, Inject, Injector,
  OnDestroy, OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { startWith, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FNavigationItemComponent } from './f-navigation-item/f-navigation-item.component';
import { FNavigationHeaderComponent } from './f-navigation-header/f-navigation-header.component';
import { FNavigationGroupComponent } from './f-navigation-group/f-navigation-group.component';
import {
  F_DOCUMENTATION_COMPONENT,
  FBadgeComponent,
  FDocumentationEnvironmentService,
  IDocumentationComponent
} from '../index';
import { INavigationGroup, INavigationItem } from './domain';
import { HandleNavigationLinksHandler, HandleNavigationLinksRequest } from '../../domain';
import { deepClone } from '@foblex/utils';

@Component({
  selector: 'f-navigation-panel',
  templateUrl: './f-navigation-panel.component.html',
  styleUrls: [ './f-navigation-panel.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    HandleNavigationLinksHandler
  ],
  imports: [
    FNavigationHeaderComponent,
    FNavigationItemComponent,
    FNavigationGroupComponent,
    RouterLink,
    FBadgeComponent,
  ]
})
export class FNavigationPanelComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  @ViewChildren(FNavigationItemComponent)
  protected items!: QueryList<FNavigationItemComponent>;

  protected value: string | undefined;

  protected navigation: INavigationGroup[] = [];

  constructor(
    private fEnvironmentService: FDocumentationEnvironmentService,
    @Inject(F_DOCUMENTATION_COMPONENT) private fDocumentation: IDocumentationComponent,
    private router: Router,
    private injector: Injector,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.navigation = this.fEnvironmentService.getNavigation();
  }

  public ngOnInit(): void {
    const currentPath = this.router.url;
    const prefix = currentPath.substring(0, currentPath.lastIndexOf('/'));
    const navigation: INavigationGroup[] = deepClone(this.fEnvironmentService.getNavigation());
    navigation.forEach((group) => {
      group.items.forEach((item) => {
        this.normalizeLink(item, prefix);
      });
    });
    this.navigation = navigation;
  }

  private normalizeLink(item: INavigationItem, prefix: string): void {
    if (item.link && !this.isExternalLink(item.link)) {
      item.link = item.link.startsWith('/') ? `${ prefix }${ item.link }` : `${ prefix }/${ item.link }`;
    }
  }

  private isExternalLink(href: string): boolean {
    return href.startsWith('www') || href.startsWith('http');
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.subscribeOnRouteChanges());
  }

  private subscribeOnRouteChanges(): Subscription {
    return this.router.events.pipe(
      startWith(new NavigationEnd(1, '', '')),
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      this.highlightLink(this.router.url);
      this.fDocumentation.onToggleNavigation(false);
      this.changeDetectorRef.detectChanges();
    });
  }

  private highlightLink(url: string): void {
    this.value = undefined;
    this.navigation.forEach((group) => {
      this.value = group.items.find((x) => {
        return url.endsWith(x.link)
      })?.link || this.value;
    });
  }

  @HostListener('click', [ '$event' ])
  public onDocumentClick(event: MouseEvent): void {
    this.injector.get(HandleNavigationLinksHandler).handle(new HandleNavigationLinksRequest(event));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
