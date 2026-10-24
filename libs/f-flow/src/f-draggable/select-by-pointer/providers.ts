import { SelectByPointer } from './select-by-pointer';
import { fExecution } from '../../_libs/f-mediator';
import { SelectByPointerRequest } from './select-by-pointer-request';

export const DRAG_SELECT_BY_POINTER_PROVIDERS = [
  fExecution(SelectByPointerRequest, SelectByPointer),
];
