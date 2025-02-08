import { FExternalItemPreparationExecution } from './preparation';
import { FExternalItemFinalizeExecution } from './finalize';
import { PreventDefaultIsExternalItemExecution } from './prevent-default-is-external-item';
import { FExternalItemCreatePreviewExecution } from './create-preview';
import { FExternalItemCreatePlaceholderExecution } from './create-placeholder';

export const F_EXTERNAL_ITEM_DRAG_AND_DROP_PROVIDERS = [

  FExternalItemCreatePlaceholderExecution,

  FExternalItemCreatePreviewExecution,

  FExternalItemFinalizeExecution,

  FExternalItemPreparationExecution,

  PreventDefaultIsExternalItemExecution,
];
