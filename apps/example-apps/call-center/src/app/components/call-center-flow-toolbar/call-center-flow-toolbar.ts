import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ECallCenterFlowAction } from './e-call-center-flow-action';
import { MatTooltip } from '@angular/material/tooltip';
import { CallCenterFlowState } from '../../state';
import { ThemeService } from '../../services/theme.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'call-center-flow-toolbar',
  templateUrl: './call-center-flow-toolbar.html',
  styleUrls: ['./call-center-flow-toolbar.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, MatIcon, MatIconButton, FormsModule, MatMenuTrigger, MatMenuItem, MatMenu],
})
export class CallCenterFlowToolbar {
  protected readonly state = inject(CallCenterFlowState);
  private readonly _themeService = inject(ThemeService);

  public readonly actionTriggered = output<ECallCenterFlowAction>();
  public readonly resetRequested = output<void>();

  protected readonly action = ECallCenterFlowAction;
  protected readonly currentTheme = this._themeService.current;
  protected readonly canDeleteSelection = this.state.canDeleteSelection;

  protected deleteSelection(): void {
    this.state.deleteSelection();
  }

  protected setTheme(theme: 'light' | 'dark'): void {
    this._themeService.setTheme(theme);
  }

  protected requestReset(): void {
    this.resetRequested.emit();
  }
}
