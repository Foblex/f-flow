import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { MetaService } from './meta.service';
import { BrowserService } from '@foblex/platform';
import { takeScreenshot } from './take-screenshot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions$: Subscription = new Subscription();

  constructor(
    matIconRegistry: MatIconRegistry,
    private renderer: Renderer2,
    private metaService: MetaService,
    private fBrowser: BrowserService,
  ) {
    matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  public ngOnInit(): void {
    if (this.getPreferredTheme() === 'dark' && !this.isDocumentContainsDarkTheme()) {
      this.renderer.addClass(this.fBrowser.document.documentElement, 'dark');
      this.fBrowser.localStorage.setItem('preferred-theme', 'dark');
    }
    this.subscriptions$.add(this.metaService.subscribeOnRouteChanges());
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
