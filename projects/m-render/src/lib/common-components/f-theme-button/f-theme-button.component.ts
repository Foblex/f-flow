import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  Renderer2
} from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { FStateService } from '../../domain/f-state.service';

@Component({
  selector: 'button[f-theme-button]',
  templateUrl: './f-theme-button.component.html',
  styleUrls: [ './f-theme-button.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FThemeButtonComponent implements OnInit {

  constructor(
    private renderer: Renderer2,
    private fState: FStateService,
    private fBrowser: BrowserService
  ) {
  }

  public ngOnInit(): void {
    if (this.fState.getPreferredTheme() === 'dark' && !this.isDocumentContainsDarkTheme()) {
      this.renderer.addClass(this.fBrowser.document.documentElement, 'dark');
      this.fBrowser.localStorage.setItem('preferred-theme', 'dark');
    }
  }

  private isDocumentContainsDarkTheme(): boolean {
    return this.fBrowser.document.documentElement.classList.contains('dark');
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.fState.getPreferredTheme() === 'light' && !this.isDocumentContainsDarkTheme()) {
      this.renderer.addClass(this.fBrowser.document.documentElement, 'dark');
      this.fBrowser.localStorage.setItem('preferred-theme', 'dark');
    } else {
      this.renderer.removeClass(this.fBrowser.document.documentElement, 'dark');
      this.fBrowser.localStorage.setItem('preferred-theme', 'light');
    }
    this.fState.updateTheme();
  }
}
