import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { BrowserService } from '@foblex/platform';
import { takeScreenshot } from './take-screenshot';
import { CookiePopup, FAnalyticsService, FMetaService, IMetaData } from '@foblex/m-render';
import { GUIDES_ENVIRONMENT } from '../../public/markdown/guides/environment';
import { EXAMPLES_ENVIRONMENT } from '../../public/markdown/examples/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CookiePopup
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  public isBrowser = false;

  constructor(
    matIconRegistry: MatIconRegistry,
    private renderer: Renderer2,
    private fMeta: FMetaService,
    private fBrowser: BrowserService,
    private fAnalytics: FAnalyticsService
  ) {
    matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    this.isBrowser = fBrowser.isBrowser();
  }

  public ngOnInit(): void {
    if (this.getPreferredTheme() === 'dark' && !this.isDocumentContainsDarkTheme()) {
      this.renderer.addClass(this.fBrowser.document.documentElement, 'dark');
      this.fBrowser.localStorage.setItem('preferred-theme', 'dark');
    }
    this.subscriptions$.add(
      this.fMeta.subscribeOnRouteChanges(DEFAULT_PAGE_DATA, [ GUIDES_ENVIRONMENT, EXAMPLES_ENVIRONMENT ])
    );
    this.fAnalytics.initialize('AW-16677977117');
  }


  private getPreferredTheme(): string {
    return this.fBrowser.localStorage.getItem('preferred-theme')
      || (this.fBrowser.window.isMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light');
  }


  private isDocumentContainsDarkTheme(): boolean {
    return this.fBrowser.document.documentElement.classList.contains('dark');
  }

  protected takeScreenshot(): void {
    takeScreenshot('f-flow').then();
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}

const DEFAULT_PAGE_DATA: IMetaData = {
  url: 'https://flow.foblex.com',
  type: 'website',
  title: 'Angular Library for Flow-Based UIs - Foblex Flow',
  app_name: 'Foblex Flow',
  locale: GUIDES_ENVIRONMENT.lang,
  description: 'Foblex Flow is an Angular library that simplifies the creation of flow-based UIs, providing components for building interactive UIs with nodes and connections',
  image: 'https://flow.foblex.com/site-preview.png',
  image_type: 'image/png',
  image_width: 2986,
  image_height: 1926
};
