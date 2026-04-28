import { MatIconRegistry } from '@angular/material/icon';
import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExternalComponentScreenshot } from './core/screenshot/external-component-screenshot';
import { SearchDialog, SearchService } from './shared/search';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SearchDialog],
  host: {
    ngSkipHydration: '',
  },
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly _iconRegistry = inject(MatIconRegistry);
  private readonly _screenshot = inject(ExternalComponentScreenshot);
  private readonly _search = inject(SearchService);

  public ngOnInit(): void {
    this._setDefaultFontSetClass();
    this._screenshot.initialize();
  }

  @HostListener('document:keydown', ['$event'])
  protected onGlobalKeyDown(event: KeyboardEvent): void {
    // `/` opens the search dialog (GitHub / Algolia DocSearch convention).
    // Cmd+K is intentionally not bound: most browsers reserve it for
    // address-bar / find shortcuts and intercepting it tends to feel
    // hostile.
    if (event.key === '/' && !this._isEditableTarget(event.target)) {
      event.preventDefault();
      this._search.toggle();
    }
  }

  private _setDefaultFontSetClass(): void {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  private _isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;

    return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
  }
}
