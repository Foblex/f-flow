import { MatIconRegistry } from '@angular/material/icon';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExternalComponentScreenshot } from './core/screenshot/external-component-screenshot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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

  public ngOnInit(): void {
    this._setDefaultFontSetClass();
    this._screenshot.initialize();
  }

  private _setDefaultFontSetClass(): void {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
