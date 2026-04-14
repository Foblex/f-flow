import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { UmlController } from '../../controllers';

@Component({
  selector: 'uml-diagram-toolbar',
  templateUrl: './diagram-toolbar.html',
  styleUrls: ['./diagram-toolbar.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatTooltip],
})
export class DiagramToolbar {
  protected readonly controller = inject(UmlController);

  protected readonly isDark = signal(document.documentElement.classList.contains('dark'));

  protected onZoomIn(): void {
    this.controller.zoomIn();
  }

  protected onZoomOut(): void {
    this.controller.zoomOut();
  }

  protected onResetZoom(): void {
    this.controller.resetZoom();
  }

  protected onFitToScreen(): void {
    this.controller.fitToScreen();
  }

  protected onToggleTheme(): void {
    document.documentElement.classList.toggle('dark');
    this.isDark.set(document.documentElement.classList.contains('dark'));
  }
}
