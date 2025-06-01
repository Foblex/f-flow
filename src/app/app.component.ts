import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import {Subscription} from 'rxjs';
import {BrowserService} from '@foblex/platform';
import {takeScreenshot} from './take-screenshot';
import {FAnalyticsService, FCookiePopupComponent, IMetaData} from '@foblex/m-render';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FCookiePopupComponent,
  ],
  host: {
    'ngSkipHydration': '',
  },
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  public isBrowser = false;

  constructor(
    matIconRegistry: MatIconRegistry,
    private renderer: Renderer2,
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
