import { EFLayoutMode } from '../enums';
import { IFLayoutOptions } from './i-f-layout-options';
import { TFLayoutWritebackHandler } from './i-f-layout-writeback-payload';
import { InjectionToken } from '@angular/core';

export const F_LAYOUT_OPTIONS = new InjectionToken<IFLayoutProviderConfig>('F_LAYOUT_OPTIONS');

export interface IFLayoutProviderConfig<
  TOptions extends IFLayoutOptions<string> = IFLayoutOptions<string>,
> {
  mode?: EFLayoutMode;

  writeback?: TFLayoutWritebackHandler | null;

  options?: Partial<TOptions>;
}
