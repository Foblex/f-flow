import { ChangeDetectionStrategy, Component, inject, OnDestroy, viewChild } from '@angular/core';
import { FCanvasChangeEvent, FCanvasComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { PointExtensions } from '@foblex/2d';
import { DOCUMENT } from '@angular/common';
import { FSelectComponent } from '@foblex/m-render';

@Component({
  selector: 'custom-nodes',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, MatCardModule, MatButton, FZoomDirective, FSelectComponent],
})
export class Example implements OnDestroy {
  private readonly _canvas = viewChild(FCanvasComponent);
  private readonly _document = inject(DOCUMENT);

  protected readonly options = [
    { key: 'option1', value: 'Option 1' },
    { key: 'option2', value: 'Option 2' },
    { key: 'option3', value: 'Option 3' },
  ];

  protected loaded(): void {
    this._canvas()?.fitToScreen(PointExtensions.initialize(100, 100), false);
  }

  protected canvasChanged(event: FCanvasChangeEvent): void {
    // Sets a CSS variable to scale Material Design controls within the canvas
    this._document.documentElement.style.setProperty('--flow-scale', `${event.scale}`);
  }

  public ngOnDestroy(): void {
    // Removes the CSS variable to prevent scaling effects outside the canvas context
    this._document.documentElement.style.removeProperty('--flow-scale');
  }
}
