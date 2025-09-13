import { ChangeDetectionStrategy, Component, inject, OnDestroy, viewChild } from '@angular/core';
import { FCanvasChangeEvent, FCanvasComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { PointExtensions } from '@foblex/2d';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { BrowserService } from '@foblex/platform';

@Component({
  selector: 'custom-nodes',
  styleUrls: ['./custom-nodes.component.scss'],
  templateUrl: './custom-nodes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    MatCardModule,
    MatButton,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    FZoomDirective,
  ],
})
export class CustomNodesComponent implements OnDestroy {
  private readonly _canvas = viewChild(FCanvasComponent);
  private readonly _browser = inject(BrowserService);

  protected loaded(): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(100, 100), false);
  }

  protected onCanvasChanged(event: FCanvasChangeEvent): void {
    // Sets a CSS variable to scale Material Design controls within the canvas
    this._browser.document.documentElement.style.setProperty('--flow-scale', `${event.scale}`);
  }

  public ngOnDestroy(): void {
    // Removes the CSS variable to prevent scaling effects outside the canvas context
    this._browser.document.documentElement.style.removeProperty('--flow-scale');
  }
}
