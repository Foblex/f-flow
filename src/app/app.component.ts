import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { Meta, Title } from '@angular/platform-browser';
import { ENGLISH_ENVIRONMENT } from '../../public/docs/en/environment';
import { filter, startWith, Subscription } from 'rxjs';
import { ChangeMetaService } from './change-meta.service';

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
    @Inject(DOCUMENT) private document: Document,
    private metaService: ChangeMetaService,
  ) {
    matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');

  }

  public ngOnInit(): void {
    if (this.getPreferredTheme() === 'dark' && !this.isDocumentContainsDarkTheme()) {
      this.renderer.addClass(this.document.documentElement, 'dark');
      localStorage.setItem('preferred-theme', 'dark');
    }
    this.subscriptions$.add(this.metaService.subscribeOnRouteChanges());
  }


  private getPreferredTheme(): string {
    return localStorage.getItem('preferred-theme')
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  private isDocumentContainsDarkTheme(): boolean {
    return this.document.documentElement.classList.contains('dark');
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
