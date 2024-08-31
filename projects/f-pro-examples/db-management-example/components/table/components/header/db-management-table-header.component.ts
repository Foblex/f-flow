import {
  ChangeDetectionStrategy,
  Component, Input,
} from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { DatabaseApiService, ETableRelationType, ITableViewModel } from '../../../../domain';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'db-management-table-header',
  templateUrl: './db-management-table-header.component.html',
  styleUrls: [ './db-management-table-header.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    MatIcon
  ]
})
export class DbManagementTableHeaderComponent {

  @Input({ required: true })
  public viewModel!: ITableViewModel;

  constructor(
    private apiService: DatabaseApiService,
  ) {
  }

  public removeTable(): void {
    this.apiService.removeTable(this.viewModel.id);
  }

  public createColumn(): void {
    this.apiService.createColumn(this.viewModel.id);
  }
}
