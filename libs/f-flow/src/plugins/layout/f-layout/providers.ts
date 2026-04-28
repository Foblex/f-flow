import { Provider, Type } from '@angular/core';
import { F_LAYOUT, FLayoutEngine } from './f-layout-engine';
import { FLayoutController } from './flow-integration';
import { F_LAYOUT_OPTIONS, IFLayoutOptions, IFLayoutProviderConfig } from './models';

export function provideFLayout<
  TOptions extends IFLayoutOptions<string>,
  T extends FLayoutEngine<TOptions>,
>(engineType: Type<T>, config?: IFLayoutProviderConfig<TOptions>): Provider[] {
  return [
    FLayoutController,
    engineType,
    {
      provide: F_LAYOUT,
      useExisting: engineType,
    },
    {
      provide: F_LAYOUT_OPTIONS,
      useValue: config ?? {},
    },
  ];
}
