import {
  canvasFactory,
  configureDiTest,
  connectorFactory,
  createMediatorHarness,
  F_FLOW_CONFIG,
  FComponentsStore,
  flowFactory,
  fSuppressDevWarnings,
  IFFlowConfig,
  MediatorHarness,
  nodeFactory,
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

describe('RunDevDiagnostics — FF1011 node position drift', () => {
  let store: FComponentsStore;
  let flowHost: HTMLElement;
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

  function addNode(id: string, position: { x: number; y: number }, cssText: string): void {
    const element = document.createElement('div');
    element.style.cssText = cssText;
    flowHost.appendChild(element);
    store.nodes.add(nodeFactory().id(id).host(element).position(position).build());
  }

  function ff1011Messages(): string[] {
    return warnSpy.calls
      .allArgs()
      .map((args) => String(args[0]))
      .filter((m) => m.includes('FF1011'));
  }

  beforeEach(() => {
    fSuppressDevWarnings(false);
    warnSpy = spyOn(console, 'warn');

    store = new FComponentsStore();
    flowHost = document.createElement('div');
    flowHost.style.cssText = 'position:absolute;left:0;top:0;width:600px;height:400px;';
    document.body.appendChild(flowHost);
    store.fFlow = flowFactory().host(flowHost).build();
    store.fCanvas = canvasFactory().build();
  });

  afterEach(() => {
    fSuppressDevWarnings(true);
    flowHost.remove();
  });

  it('stays silent when the rendered box matches fNodePosition', () => {
    addNode(
      'ff1011-aligned',
      { x: 40, y: 20 },
      'position:absolute;left:40px;top:20px;width:100px;height:50px;',
    );

    setup().execute(new RunDevDiagnosticsRequest());

    expect(ff1011Messages()).toEqual([]);
  });

  it('warns when app CSS moves the node host away from its model position', () => {
    addNode(
      'ff1011-drifted',
      { x: 40, y: 20 },
      'position:absolute;left:40px;top:20px;width:100px;height:50px;margin-left:120px;',
    );

    setup().execute(new RunDevDiagnosticsRequest());

    const messages = ff1011Messages();
    expect(messages.length).toBe(1);
    expect(messages[0]).toContain('ff1011-drifted');
    expect(messages[0]).toContain('fNodePosition');
  });

  it('stays silent for a rotated node whose center matches the model', () => {
    addNode(
      'ff1011-rotated',
      { x: 40, y: 20 },
      'position:absolute;left:40px;top:20px;width:100px;height:50px;transform:rotate(45deg);',
    );

    setup().execute(new RunDevDiagnosticsRequest());

    expect(ff1011Messages()).toEqual([]);
  });

  it('is switched off by maxNodePositionDrift: 0', () => {
    addNode(
      'ff1011-disabled',
      { x: 40, y: 20 },
      'position:absolute;left:40px;top:20px;width:100px;height:50px;margin-left:120px;',
    );

    setup({ diagnostics: { maxNodePositionDrift: 0 } }).execute(new RunDevDiagnosticsRequest());

    expect(ff1011Messages()).toEqual([]);
  });

  it('tolerates a drift under a raised threshold', () => {
    addNode(
      'ff1011-tolerated',
      { x: 40, y: 20 },
      'position:absolute;left:40px;top:20px;width:100px;height:50px;margin-left:6px;',
    );

    setup({ diagnostics: { maxNodePositionDrift: 10 } }).execute(new RunDevDiagnosticsRequest());

    expect(ff1011Messages()).toEqual([]);
  });
});
