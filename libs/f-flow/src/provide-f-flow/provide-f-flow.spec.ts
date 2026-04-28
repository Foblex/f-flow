import { EFFlowFeatureKind, IFFlowFeature } from './f-flow-feature';
import { F_FLOW_CONFIG } from './i-f-flow-config';
import { provideFFlow } from './provide-f-flow';

function makeFeature(kind: EFFlowFeatureKind = EFFlowFeatureKind.REFLOW_ON_RESIZE): IFFlowFeature {
  return {
    kind,
    providers: [{ provide: 'some-token', useValue: kind }],
  };
}

describe('provideFFlow', () => {
  it('produces F_FLOW_CONFIG with empty config when called with zero args', () => {
    const providers = provideFFlow();

    const configEntry = providers.find(
      (p) => typeof p === 'object' && 'provide' in p && p.provide === F_FLOW_CONFIG,
    );

    expect(configEntry).toBeDefined();
    expect(configEntry && 'useValue' in configEntry ? configEntry.useValue : null).toEqual({});
  });

  it('threads a base config through F_FLOW_CONFIG', () => {
    const providers = provideFFlow({ id: 'main' });

    const configEntry = providers.find(
      (p) => typeof p === 'object' && 'provide' in p && p.provide === F_FLOW_CONFIG,
    );

    expect(configEntry && 'useValue' in configEntry ? configEntry.useValue : null).toEqual({
      id: 'main',
    });
  });

  it('treats the first arg as a feature when it has a kind discriminator', () => {
    const feature = makeFeature();
    const providers = provideFFlow(feature);

    const configEntry = providers.find(
      (p) => typeof p === 'object' && 'provide' in p && p.provide === F_FLOW_CONFIG,
    );

    expect(configEntry && 'useValue' in configEntry ? configEntry.useValue : null).toEqual({});
    expect(providers.length).toBe(1 + feature.providers.length);
  });

  it('accepts config followed by features', () => {
    const feature = makeFeature();
    const providers = provideFFlow({ id: 'flow-a' }, feature);

    expect(providers.length).toBe(1 + feature.providers.length);
    expect(providers).toContain(feature.providers[0]!);
  });

  it('flattens multiple features into the provider list in order', () => {
    const a = makeFeature(EFFlowFeatureKind.REFLOW_ON_RESIZE);
    const b: IFFlowFeature = {
      kind: EFFlowFeatureKind.REFLOW_ON_RESIZE,
      providers: [{ provide: 'token-b', useValue: 'b' }],
    };

    const providers = provideFFlow(a, b);

    const aIndex = providers.indexOf(a.providers[0]!);
    const bIndex = providers.indexOf(b.providers[0]!);

    expect(aIndex).toBeGreaterThan(-1);
    expect(bIndex).toBeGreaterThan(-1);
    expect(aIndex).toBeLessThan(bIndex);
  });
});
