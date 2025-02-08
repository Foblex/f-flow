import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { startWith, Subscription } from 'rxjs';
import { FStateService } from '../../domain/f-state.service';
import { Router } from '@angular/router';
import { INavigationGroup, INavigationItem } from '../f-navigation-panel';
import { FDocumentationEnvironmentService } from '../f-documentation-environment.service';

@Component({
  selector: 'a[f-preview]',
  templateUrl: './f-preview.component.html',
  styleUrls: [ './f-preview.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.href]': 'url',
    '[attr.title]': 'viewModel?.text',
  }
})
export class FPreviewComponent implements OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  public item: string | undefined;

  public group: string | undefined;

  protected viewModel: INavigationItem | undefined;

  protected src: string | undefined;

  protected url: string | undefined;

  constructor(
    private fEnvironment: FDocumentationEnvironmentService,
    private fState: FStateService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public initialize(): void {
    this.viewModel = this.getNavigationItem(this.getNavigationGroup()!);
    this.url = this.normalizeLink(this.viewModel!.link, this.getUrlPrefix());
    this.subscriptions$.add(this.fState.theme$.pipe(startWith(null)).subscribe(() => this.updateTheme()));
  }

  private getNavigationGroup(): INavigationGroup | undefined {
    return this.fEnvironment.getNavigation().find((x) => x.text === this.group);
  }

  private getNavigationItem(group: INavigationGroup): INavigationItem | undefined {
    return group.items.find((x) => x.link === this.item);
  }

  private updateTheme(): void {
    this.src = this.fState.getPreferredTheme() === 'dark' ? this.viewModel?.image_dark : this.viewModel?.image;
    if (!this.src) {
      this.src = this.viewModel?.image;
    }
    this.changeDetectorRef.markForCheck();
  }

  private normalizeLink(link: string, prefix: string): string {
    if (!this.isExternalLink(link)) {
      return link.startsWith('/') ? `${ prefix }${ link }` : `${ prefix }/${ link }`;
    }
    return link;
  }

  private getUrlPrefix(): string {
    return this.router.url.substring(0, this.router.url.lastIndexOf('/'));
  }

  private isExternalLink(href: string): boolean {
    return href.startsWith('www') || href.startsWith('http');
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
