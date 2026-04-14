import { Component, inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { ManagementFlow } from './components/flow/management-flow';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ManagementFlow],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly _iconRegistry = inject(MatIconRegistry);

  public ngOnInit(): void {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
