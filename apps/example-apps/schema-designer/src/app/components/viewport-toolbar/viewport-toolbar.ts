import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlowController } from '../../controllers/flow-controller';

@Component({
  selector: 'viewport-toolbar',
  templateUrl: './viewport-toolbar.html',
  styleUrl: './viewport-toolbar.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class ViewportToolbar {
  private readonly _controller = inject(FlowController);

  protected readonly isDark = signal(document.documentElement.classList.contains('dark'));

  protected zoomIn(): void {
    this._controller.zoomIn();
  }

  protected zoomOut(): void {
    this._controller.zoomOut();
  }

  protected fitToScreen(): void {
    this._controller.fitToScreen();
  }

  protected resetView(): void {
    this._controller.resetView();
  }

  protected toggleTheme(): void {
    document.documentElement.classList.toggle('dark');
    this.isDark.set(document.documentElement.classList.contains('dark'));
  }
}
