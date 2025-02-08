import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { IDocsHeaderNavigationItem } from '../../domain';
import { Router, RouterLink } from '@angular/router';
import { FDocumentationEnvironmentService } from '../f-documentation-environment.service';

@Component({
  selector: 'f-header-menu',
  templateUrl: './f-header-menu.component.html',
  styleUrls: [ './f-header-menu.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink
  ]
})
export class FHeaderMenuComponent implements OnInit {

  protected navigation: IDocsHeaderNavigationItemViewModel[] = [];

  private _router = inject(Router);
  private _fEnvironmentService = inject(FDocumentationEnvironmentService);

  public ngOnInit(): void {

    this.navigation = this._fEnvironmentService.getHeaderNavigation().map((x) => {
      return {
        ...x,
        isActive: this._router.url.startsWith(x.link)
      };
    });
  }
}

type IDocsHeaderNavigationItemViewModel = IDocsHeaderNavigationItem & { isActive: boolean };
