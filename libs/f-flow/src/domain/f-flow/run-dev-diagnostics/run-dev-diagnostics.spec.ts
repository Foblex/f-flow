import {
  configureDiTest,
  connectorFactory,
  createMediatorHarness,
  F_FLOW_CONFIG,
  FComponentsStore,
  fSuppressDevWarnings,
  IFFlowConfig,
  MediatorHarness,
  RunDevDiagnostics,
  RunDevDiagnosticsRequest,
  valueProvider,
} from '@foblex/flow';

describe('RunDevDiagnostics — FF1010 zero-size connectors', () => {
  let store: FComponentsStore;
  let host: HTMLElement;
  let warnSpy: jasmine.Spy;

  function setup(config?: IFFlowConfig): MediatorHarness {
    configureDiTest({
      providers: [
        RunDevDiagnostics,
        valueProvider(FComponentsStore, store),
        ...(config ? [valueProvider(F_FLOW_CONFIG, config)] : []),
      ],
    });

    return createMediatorHarness();
  }

  function addConnector(id: string, cssText: string): void {
    const element = document.createElement('div');
    element.style.cssText = cssText;
    host.appendChild(element);
    store.connectors.add(connectorFactory().id(id).host(element).build());
  }

  beforeEach(() => {
    fSuppressDevWarnings(false);
    warnSpy = spyOn(console, 'warn');

    store = new FComponentsStore();
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  afterEach(() => {
    fSuppressDevWarnings(true);
    host.remove();
  });

  it('warns for a rendered connector whose box has no size', () => {
    addConnector('ff1010-zero', 'position:absolute;');

    setup().execute(new RunDevDiagnosticsRequest());

    const messages = warnSpy.calls.allArgs().map((args) => String(args[0]));
    expect(messages.some((m) => m.includes('FF1010') && m.includes('ff1010-zero'))).toBe(true);
  });

  it('stays silent for a connector with a real size', () => {
    addConnector('ff1010-sized', 'position:absolute;width:10px;height:10px;');

    setup().execute(new RunDevDiagnosticsRequest());

    const messages = warnSpy.calls.allArgs().map((args) => String(args[0]));
    expect(messages.some((m) => m.includes('FF1010'))).toBe(false);
  });

  it('is switched off by minConnectorSize: 0', () => {
    addConnector('ff1010-disabled', 'position:absolute;');

    setup({ diagnostics: { minConnectorSize: 0 } }).execute(new RunDevDiagnosticsRequest());

    const messages = warnSpy.calls.allArgs().map((args) => String(args[0]));
    expect(messages.some((m) => m.includes('FF1010'))).toBe(false);
  });

  it('respects a raised threshold', () => {
    addConnector('ff1010-small', 'position:absolute;width:2px;height:2px;');

    setup({ diagnostics: { minConnectorSize: 4 } }).execute(new RunDevDiagnosticsRequest());

    const messages = warnSpy.calls.allArgs().map((args) => String(args[0]));
    expect(messages.some((m) => m.includes('FF1010') && m.includes('ff1010-small'))).toBe(true);
  });
});
