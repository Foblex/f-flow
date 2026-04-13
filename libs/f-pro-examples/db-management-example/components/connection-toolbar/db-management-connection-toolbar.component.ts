import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DatabaseApiService, ETableRelationType, ITableConnectionViewModel } from '../../domain';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'div[db-management-connection-toolbar]',
  templateUrl: './db-management-connection-toolbar.component.html',
  styleUrls: [ './db-management-connection-toolbar.component.scss' ],
  standalone: true,
  imports: [
    MatIcon,
    MatTooltip
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DbManagementConnectionToolbarComponent {

  @Input({ required: true })
  public viewModel!: ITableConnectionViewModel;

  public eTableRelationType = ETableRelationType;

  constructor(
    private apiService: DatabaseApiService,
  ) {
  }

  public changeConnectionType(type: ETableRelationType): void {
    this.apiService.changeConnectionType(this.viewModel.id, type);
  }

  public removeConnection(): void {
    this.apiService.removeConnection(this.viewModel.id);
  }
}
