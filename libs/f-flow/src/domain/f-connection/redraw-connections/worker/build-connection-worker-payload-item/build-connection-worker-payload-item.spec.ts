import {
  configureDiTest,
  EFConnectableSide,
  EFConnectionConnectableSide,
  FConnectionBase,
  injectFromDi,
  valueProvider,
} from '@foblex/flow';
import { FComponentsStore } from '../../../../../f-storage';
import { FConnectorBase } from '../../../../../f-connectors';
import { IConnectionGeometry } from '../../models';
import { BuildConnectionWorkerPayloadItem } from './build-connection-worker-payload-item';
import { BuildConnectionWorkerPayloadItemRequest } from './build-connection-worker-payload-item-request';

describe('BuildConnectionWorkerPayloadItem', () => {
  let execution: BuildConnectionWorkerPayloadItem;

  beforeEach(() => {
    configureDiTest({
      providers: [
        BuildConnectionWorkerPayloadItem,
        valueProvider(FComponentsStore, new FComponentsStore()),
      ],
    });

    execution = injectFromDi(BuildConnectionWorkerPayloadItem);
  });

  it('uses resolved source and target sides instead of deprecated aliases', () => {
    const connection = {
      fBehavior: 'fixed',
      fOutputSide: () => EFConnectionConnectableSide.TOP,
      fInputSide: () => EFConnectionConnectableSide.BOTTOM,
      sourceSide: () => EFConnectionConnectableSide.RIGHT,
      targetSide: () => EFConnectionConnectableSide.LEFT,
    } as unknown as FConnectionBase;
    const geometry = {
      source: {
        fNodeId: 'source-node',
        fConnectableSide: EFConnectableSide.BOTTOM,
      } as FConnectorBase,
      target: {
        fNodeId: 'target-node',
        fConnectableSide: EFConnectableSide.TOP,
      } as FConnectorBase,
      sourceRect: { x: 0, y: 0, width: 20, height: 20 },
      targetRect: { x: 100, y: 0, width: 20, height: 20 },
    } as IConnectionGeometry;

    const result = execution.handle(
      new BuildConnectionWorkerPayloadItemRequest(connection, geometry, 3),
    );

    expect(result.outputSide).toBe(EFConnectionConnectableSide.RIGHT);
    expect(result.inputSide).toBe(EFConnectionConnectableSide.LEFT);
  });
});
