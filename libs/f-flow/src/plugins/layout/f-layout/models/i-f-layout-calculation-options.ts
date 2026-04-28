import { EFLayoutMode } from '../enums';
import { IFLayoutOptions } from './i-f-layout-options';

export type IFLayoutCalculationOptions<
  TOptions extends IFLayoutOptions<string> = IFLayoutOptions<string>,
> = Partial<TOptions> & {
  flowId?: string;
  mode?: EFLayoutMode;
};
