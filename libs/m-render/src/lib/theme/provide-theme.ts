import { Provider } from '@angular/core';
import { ThemeService } from './theme.service';

export function provideTheme(): Provider[] {
  return [
    {
      provide: ThemeService,
      useClass: ThemeService,
    },
  ];
}
