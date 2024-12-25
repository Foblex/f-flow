import { EXTERNAL_ITEM_PREPARATION_PROVIDERS } from './external-item-preparation';
import { EXTERNAL_ITEM_FINALIZE_PROVIDERS } from './external-item-finalize';
import { PreventDefaultIsExternalItemExecution } from './prevent-default-is-external-item';

export const F_EXTERNAL_ITEM_DRAG_AND_DROP_PROVIDERS = [

  ...EXTERNAL_ITEM_FINALIZE_PROVIDERS,

  ...EXTERNAL_ITEM_PREPARATION_PROVIDERS,

  PreventDefaultIsExternalItemExecution,
];
