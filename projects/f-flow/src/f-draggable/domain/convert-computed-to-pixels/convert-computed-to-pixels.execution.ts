import { Injectable } from '@angular/core';
import { ConvertComputedToPixelsRequest } from './convert-computed-to-pixels-request';
import { WindowService } from '@foblex/core';
import { FExecutionRegister, IExecution } from '../../../infrastructure';

@Injectable()
@FExecutionRegister(ConvertComputedToPixelsRequest)
export class ConvertComputedToPixelsExecution implements IExecution<ConvertComputedToPixelsRequest, number> {

  constructor(
    private windowService: WindowService
  ) {
  }

  public handle(request: ConvertComputedToPixelsRequest): number {
    return this.convert(request.value, request.clientWidth, request.clientHeight, request.fontSize);
  }

  private convert(value: string, clientWidth: number, clientHeight: number, fontSize: string): number {
    if (value.endsWith('px')) {
      return parseFloat(value);
    } else if (value.endsWith('%')) {
      const percentage = parseFloat(value) / 100;
      return Math.max(clientWidth, clientHeight) * percentage;
    } else if (value.endsWith('em')) {
      return parseFloat(value) * parseFloat(fontSize);
    } else if (value.endsWith('rem')) {
      return parseFloat(value) * parseFloat(getComputedStyle(this.windowService.getWindow().document.documentElement).fontSize);
    } else if (value.endsWith('vh')) {
      const vh = this.windowService.getWindow().innerHeight / 100;
      return parseFloat(value) * vh;
    } else if (value.endsWith('vw')) {
      const vw = this.windowService.getWindow().innerWidth / 100;
      return parseFloat(value) * vw;
    }
    return parseFloat(value) || 0;
  }
}
