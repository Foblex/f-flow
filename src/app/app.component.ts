import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import {takeScreenshot} from './take-screenshot';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {startWith, take} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AssistantComponent} from "./assistant/assistant.component";
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  host: {
    'ngSkipHydration': '',
  },
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private readonly _iconRegistry = inject(MatIconRegistry);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _dialog = inject(MatDialog);
  private readonly _destroyRef = inject(DestroyRef);

  public ngOnInit() {
    this._setDefaultFontSetClass();
   // this._listenForSearch();
  }

  private _setDefaultFontSetClass(): void {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  // private _listenForSearch(): void {
  //   this._route.fragment.pipe(
  //     takeUntilDestroyed(this._destroyRef), startWith(this._route.snapshot.fragment)
  //   ).subscribe(fragment => {
  //     if (fragment === 'search') {
  //       this._openAssistant();
  //     }
  //   });
  // }

  // private _openAssistant(): void {
  //   this._dialog.open(AssistantComponent, {
  //     width: '800px', maxHeight: '80vh',
  //   }).afterClosed().pipe(
  //     take(1), takeUntilDestroyed(this._destroyRef)
  //   ).subscribe(() => this._clearSearch());
  // }
  //
  // private _clearSearch(): void {
  //   this._router.navigate([], {
  //     fragment: '',
  //     queryParamsHandling: 'preserve',
  //     replaceUrl: true, // чтобы не добавлять новую запись в историю
  //   });
  // }
  //
  // protected takeScreenshot(): void {
  //   takeScreenshot('f-flow').then();
  // }
}
