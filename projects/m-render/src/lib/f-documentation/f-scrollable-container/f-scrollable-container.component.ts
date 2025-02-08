import {
  ChangeDetectionStrategy,
  Component, ElementRef, OnDestroy, OnInit
} from '@angular/core';
import { FScrollableService } from './f-scrollable.service';

@Component({
  selector: 'f-scrollable-container',
  templateUrl: './f-scrollable-container.component.html',
  styleUrls: [ './f-scrollable-container.component.scss' ],
  providers: [
    FScrollableService
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FScrollableContainerComponent implements OnInit, OnDestroy {

  private get hostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private fScrollableService: FScrollableService
  ) {
  }

  public ngOnInit(): void {
    this.fScrollableService.setContainer(this.hostElement);
  }

  public ngOnDestroy(): void {
    this.fScrollableService.dispose();
  }
}
