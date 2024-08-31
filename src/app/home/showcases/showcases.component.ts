import { Component } from '@angular/core';
import {
  VpFlowComponent
} from '@pro-examples';

@Component({
  selector: 'showcases',
  templateUrl: './showcases.component.html',
  styleUrl: './showcases.component.scss',
  imports: [
    VpFlowComponent
  ],
  standalone: true
})
export class ShowcasesComponent {

}
