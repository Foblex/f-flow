import { Router } from '@angular/router';

export class HandleNavigationLinksRequest {
  constructor(
    public event: MouseEvent,
    public window: Window,
    public router: Router,
  ) {
  }
}
