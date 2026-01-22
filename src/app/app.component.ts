import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  host: {
    'ngSkipHydration': '',
  },
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly _iconRegistry = inject(MatIconRegistry);

  public ngOnInit() {
    this._setDefaultFontSetClass();
  }

  private _setDefaultFontSetClass(): void {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
