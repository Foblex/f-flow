import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, DestroyRef, inject, OnInit
} from '@angular/core';
import { FNavigationPanelComponent } from './f-navigation-panel';
import { FHeaderComponent } from './f-header/f-header.component';
import { FScrollableContainerComponent } from './f-scrollable-container';
import { RouterOutlet } from '@angular/router';
import { F_DOCUMENTATION_COMPONENT, IDocumentationComponent } from './i-documentation-component';
import { INTERNAL_ENVIRONMENT_SERVICE } from '../domain';
import { FDocumentationEnvironmentService } from './f-documentation-environment.service';
import { FPopoverService } from '../common-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'f-documentation',
  templateUrl: './f-documentation.component.html',
  styleUrls: [ './f-documentation.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FDocumentationEnvironmentService,
    FPopoverService,
    { provide: INTERNAL_ENVIRONMENT_SERVICE, useExisting: FDocumentationEnvironmentService },
    { provide: F_DOCUMENTATION_COMPONENT, useExisting: FDocumentationComponent }
  ],
  imports: [
    FNavigationPanelComponent,
    FHeaderComponent,
    FScrollableContainerComponent,
    RouterOutlet
  ]
})
export class FDocumentationComponent implements IDocumentationComponent, OnInit {

  protected isNavigationVisible: boolean = false;

  protected popoverMessage: string | null = null;

  private _fPopover = inject(FPopoverService);
  private _destroyRef = inject(DestroyRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  public ngOnInit() {
    this._fPopover.dispose(this._destroyRef);
    this._subscribeOnPopover();
  }

  private _subscribeOnPopover(): void {
    this._fPopover.popover$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((x) => {
      this.popoverMessage = x;
      this._changeDetectorRef.markForCheck();
    });
  }

  public onToggleNavigation(value: boolean): void {
    this.isNavigationVisible = value;
    this._changeDetectorRef.markForCheck();
  }
}
