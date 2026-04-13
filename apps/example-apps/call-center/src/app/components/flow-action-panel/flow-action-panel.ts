import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FlowActionPanelAction } from './flow-action-panel-action';
import { MatTooltip } from '@angular/material/tooltip';
import { FlowStore } from '../../store/flow-store';
import { ThemeService } from '../../services/theme.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'flow-action-panel',
  templateUrl: './flow-action-panel.html',
  styleUrls: ['./flow-action-panel.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, MatIcon, MatIconButton, FormsModule, MatMenuTrigger, MatMenuItem, MatMenu],
})
export class FlowActionPanel {
  protected readonly store = inject(FlowStore);
  private readonly _themeService = inject(ThemeService);

  protected get currentTheme() {
    return this._themeService.current;
  }

  public readonly processAction = output<FlowActionPanelAction>();
  public readonly resetFlow = output<void>();

  protected readonly action = FlowActionPanelAction;
  protected readonly canRemove = this.store.canRemove;

  protected removeSelected(): void {
    this.store.removeSelected();
  }

  protected toggleTheme(theme: 'light' | 'dark'): void {
    this._themeService.toggle(theme);
  }

  protected reset(): void {
    this.resetFlow.emit();
  }
}
