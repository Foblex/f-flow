import { FConnectorBase, FSourceConnectorBase } from '../../../f-connectors';
import { filterConnectableTargets } from './filter-connectable-targets';

interface ITargetStub {
  id: string;
  nodeId: string;
  canBeConnected?: boolean;
  category?: string;
}

function target({ id, nodeId, canBeConnected = true, category }: ITargetStub): FConnectorBase {
  return {
    fId: () => id,
    fNodeId: nodeId,
    canBeConnected,
    category: () => category,
  } as unknown as FConnectorBase;
}

function source(options: {
  nodeId: string;
  allowList?: string[];
  selfConnectable?: boolean;
}): FSourceConnectorBase {
  const allowList = options.allowList ?? [];

  return {
    fNodeId: options.nodeId,
    isSelfConnectable: options.selfConnectable ?? false,
    hasConnectionLimits: allowList.length > 0,
    canConnectTo: (x: FConnectorBase) =>
      [x.fId(), x.category?.()].some((c) => !!c && allowList.includes(c as string)),
  } as unknown as FSourceConnectorBase;
}

describe('filterConnectableTargets', () => {
  it('should exclude targets that cannot be connected', () => {
    const result = filterConnectableTargets(source({ nodeId: 'a' }), [
      target({ id: 't1', nodeId: 'b' }),
      target({ id: 't2', nodeId: 'b', canBeConnected: false }),
    ]);

    expect(result.map((x) => x.fId())).toEqual(['t1']);
  });

  it('should exclude same-node targets unless the source is self-connectable', () => {
    const targets = [target({ id: 'own', nodeId: 'a' }), target({ id: 'other', nodeId: 'b' })];

    expect(filterConnectableTargets(source({ nodeId: 'a' }), targets).map((x) => x.fId())).toEqual([
      'other',
    ]);
    expect(
      filterConnectableTargets(source({ nodeId: 'a', selfConnectable: true }), targets).map((x) =>
        x.fId(),
      ),
    ).toEqual(['own', 'other']);
  });

  it('should narrow with the allow-list without overriding the base rules', () => {
    const result = filterConnectableTargets(
      source({ nodeId: 'a', allowList: ['allowed', 'disabled-but-allowed', 'own-allowed'] }),
      [
        target({ id: 'allowed', nodeId: 'b' }),
        target({ id: 'disabled-but-allowed', nodeId: 'b', canBeConnected: false }),
        target({ id: 'own-allowed', nodeId: 'a' }),
        target({ id: 'not-listed', nodeId: 'b' }),
      ],
    );

    expect(result.map((x) => x.fId())).toEqual(['allowed']);
  });

  it('should match the allow-list by category as well as by id', () => {
    const result = filterConnectableTargets(source({ nodeId: 'a', allowList: ['inputs'] }), [
      target({ id: 't1', nodeId: 'b', category: 'inputs' }),
      target({ id: 't2', nodeId: 'b', category: 'other' }),
    ]);

    expect(result.map((x) => x.fId())).toEqual(['t1']);
  });
});
