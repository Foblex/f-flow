import { Component } from '@angular/core';
import {
  VpFlowComponent
} from '@pro-examples';
import { DbManagementFlowComponent } from '../../../../projects/f-pro-examples/db-management-example';

@Component({
  selector: 'showcases',
  templateUrl: './showcases.component.html',
  styleUrl: './showcases.component.scss',
  imports: [
    VpFlowComponent,
    DbManagementFlowComponent
  ],
  standalone: true
})
export class ShowcasesComponent {

}
