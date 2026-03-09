import { Injectable } from '@angular/core';
import { TFConnectionWorkerPendingRequest } from './t-f-connection-worker-pending-request';

@Injectable()
export class FConnectionWorker {
  public worker: Worker | null = null;

  public nextRequestId = 0;
  public isDisabled = false;

  public readonly pending = new Map<number, TFConnectionWorkerPendingRequest>();

  public resetRuntime(error: Error): void {
    this.pending.forEach((request) => request.reject(error));
    this.pending.clear();

    this.worker?.terminate();
    this.worker = null;
  }

  public dispose(): void {
    this.resetRuntime(new Error('Connection worker was destroyed.'));
  }
}
