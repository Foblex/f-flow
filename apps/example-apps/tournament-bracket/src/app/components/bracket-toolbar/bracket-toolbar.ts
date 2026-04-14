import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ETournamentLayoutAlgorithm } from '../../layout';
import { TournamentBracketState } from '../../state';
import { BracketController } from '../../controllers';

interface ILayoutOption {
  algorithm: ETournamentLayoutAlgorithm;
  label: string;
  icon: string;
}

@Component({
  selector: 'bracket-toolbar',
  templateUrl: './bracket-toolbar.html',
  styleUrls: ['./bracket-toolbar.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatTooltip],
})
export class BracketToolbar {
  private readonly _state = inject(TournamentBracketState);
  private readonly _controller = inject(BracketController);

  protected readonly isDark = signal(document.documentElement.classList.contains('dark'));

  protected readonly currentAlgorithm = this._state.algorithm;

  protected readonly layoutOptions: ILayoutOption[] = [
    { algorithm: ETournamentLayoutAlgorithm.STANDARD, label: 'Standard', icon: 'account_tree' },
    { algorithm: ETournamentLayoutAlgorithm.MIRRORED, label: 'Mirrored', icon: 'swap_vert' },
    { algorithm: ETournamentLayoutAlgorithm.COMPACT, label: 'Compact', icon: 'grid_view' },
  ];

  protected onLayoutChange(algorithm: ETournamentLayoutAlgorithm): void {
    this._state.setAlgorithm(algorithm);
  }

  protected onFitToScreen(): void {
    this._controller.fitToScreen();
  }

  protected onZoomIn(): void {
    this._controller.zoomIn();
  }

  protected onZoomOut(): void {
    this._controller.zoomOut();
  }

  protected onResetZoom(): void {
    this._controller.resetZoom();
  }

  protected onToggleTheme(): void {
    document.documentElement.classList.toggle('dark');
    this.isDark.set(document.documentElement.classList.contains('dark'));
  }
}
