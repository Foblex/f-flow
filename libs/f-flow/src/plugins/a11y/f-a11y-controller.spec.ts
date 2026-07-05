import { TestBed } from '@angular/core/testing';
import { FMediator } from '@foblex/mediator';
import { FComponentsStore } from '../../f-storage';
import { FChannel } from '../../reactivity';
import {
  FCreateConnectionSession,
  FDeleteSelectedEvent,
  FDraggableDataContext,
  FMoveNodesEvent,
} from '../../f-draggable';
import { GetCurrentSelectionRequest, SelectRequest } from '../../domain';
import { FA11yAnnouncer } from './f-a11y-announcer';
import { FA11yController } from './f-a11y-controller';
import { F_A11Y_CONFIG, IFA11yConfig, mergeA11yConfig } from './i-f-a11y';

interface INodeStubOptions {
  id: string;
  x: number;
  y: number;
  selectionDisabled?: boolean;
  draggingDisabled?: boolean;
}

function createNodeStub({ id, x, y, selectionDisabled, draggingDisabled }: INodeStubOptions) {
  const hostElement = document.createElement('div');
  hostElement.style.cssText = `position:absolute;width:100px;height:50px;left:${x}px;top:${y}px;`;
  hostElement.setAttribute('data-f-node-id', id);

  return {
    fId: () => id,
    hostElement,
    _position: { x, y },
    position: { set: jasmine.createSpy(`position.set ${id}`) },
    fSelectionDisabled: () => !!selectionDisabled,
    fDraggingDisabled: () => !!draggingDisabled,
    connectors: [],
    isContains: (element: HTMLElement) => hostElement.contains(element),
  };
}

describe('FA11yController keyboard layer', () => {
  let host: HTMLElement;
  let controller: FA11yController;
  let store: {
    flowHost: HTMLElement;
    nodes: { getAll: () => unknown[] };
    connections: { getAll: () => unknown[] };
    instances: { get: () => undefined };
    nodesChanges$: FChannel;
    connectionsChanges$: FChannel;
    fDraggable: {
      disabled: boolean;
      fMoveNodes: { emit: jasmine.Spy };
      fDeleteSelected: { emit: jasmine.Spy };
    };
    fCanvas: undefined;
  };
  let nodes: ReturnType<typeof createNodeStub>[];
  let selection: { fNodeIds: string[]; fGroupIds: string[]; fConnectionIds: string[] };
  let selectRequests: SelectRequest[];
  let announcements: string[];

  function setup(config?: IFA11yConfig): void {
    host = document.createElement('div');
    document.body.appendChild(host);

    nodes = [createNodeStub({ id: 'a', x: 0, y: 0 }), createNodeStub({ id: 'b', x: 300, y: 0 })];
    nodes.forEach((node) => host.appendChild(node.hostElement));

    selection = { fNodeIds: [], fGroupIds: [], fConnectionIds: [] };
    selectRequests = [];
    announcements = [];

    store = {
      flowHost: host,
      nodes: { getAll: () => nodes },
      connections: { getAll: () => [] },
      instances: { get: () => undefined },
      nodesChanges$: new FChannel(),
      connectionsChanges$: new FChannel(),
      fDraggable: {
        disabled: false,
        fMoveNodes: { emit: jasmine.createSpy('fMoveNodes.emit') },
        fDeleteSelected: { emit: jasmine.createSpy('fDeleteSelected.emit') },
      },
      fCanvas: undefined,
    };

    const mediator = {
      execute: (request: unknown) => {
        if (request instanceof GetCurrentSelectionRequest) {
          return { ...selection };
        }
        if (request instanceof SelectRequest) {
          selectRequests.push(request);
          selection = {
            fNodeIds: [...request.nodes],
            fGroupIds: [],
            fConnectionIds: [...request.connections],
          };
        }

        return undefined;
      },
    };

    TestBed.configureTestingModule({
      providers: [
        FA11yController,
        FDraggableDataContext,
        { provide: FComponentsStore, useValue: store },
        { provide: FMediator, useValue: mediator },
        { provide: FCreateConnectionSession, useValue: { begin: () => false, cancel: () => {} } },
        {
          provide: FA11yAnnouncer,
          useValue: { announce: (message: string) => announcements.push(message) },
        },
        { provide: F_A11Y_CONFIG, useValue: mergeA11yConfig(config) },
      ],
    });

    controller = TestBed.inject(FA11yController);
    controller.initialize();
  }

  function keydown(key: string, options: KeyboardEventInit = {}): KeyboardEvent {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    });
    host.dispatchEvent(event);

    return event;
  }

  function keyup(key: string): void {
    host.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
  }

  afterEach(() => {
    controller.destroy();
    host.remove();
    TestBed.resetTestingModule();
  });

  it('should select the nearest node with an arrow key', () => {
    setup();

    keydown('ArrowRight');

    expect(selection.fNodeIds).toEqual(['a']);
    keydown('ArrowRight');
    expect(selection.fNodeIds).toEqual(['b']);
  });

  it('should never handle keys typed inside interactive content', () => {
    setup();
    const input = document.createElement('input');
    nodes[0].hostElement.appendChild(input);

    const event = new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true });
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBeFalse();
    expect(store.fDraggable.fDeleteSelected.emit).not.toHaveBeenCalled();
  });

  it('should leave OS shortcuts alone for single-character bindings', () => {
    setup();
    keydown('ArrowRight');

    const event = keydown('c', { ctrlKey: true });

    expect(event.defaultPrevented).toBeFalse();
  });

  it('should move the whole selection through the grab mode and emit one fMoveNodes on drop', () => {
    setup();
    keydown('ArrowRight');
    keydown('ArrowRight', { shiftKey: true });
    expect(selection.fNodeIds).toEqual(['a', 'b']);

    keydown(' ');
    keyup(' ');
    keydown('ArrowDown');
    keydown(' ');
    keyup(' ');

    expect(nodes[0].position.set).toHaveBeenCalledWith({ x: 0, y: 10 });
    expect(nodes[1].position.set).toHaveBeenCalledWith({ x: 300, y: 10 });
    expect(store.fDraggable.fMoveNodes.emit).toHaveBeenCalledTimes(1);
    const event = store.fDraggable.fMoveNodes.emit.calls.mostRecent().args[0] as FMoveNodesEvent;
    expect(event.nodes.map((x) => x.id)).toEqual(['a', 'b']);
  });

  it('should drop on grab-key release after moving while held (quasimode)', () => {
    setup();
    keydown('ArrowRight');

    keydown(' ');
    keydown(' ', { repeat: true });
    keydown('ArrowRight');
    keyup(' ');

    expect(store.fDraggable.fMoveNodes.emit).toHaveBeenCalledTimes(1);
  });

  it('should revert every grabbed node on Escape', () => {
    setup();
    keydown('ArrowRight');
    keydown(' ');
    keydown('ArrowRight');
    keydown('Escape');

    expect(nodes[0].position.set).toHaveBeenCalledWith({ x: 0, y: 0 });
    expect(store.fDraggable.fMoveNodes.emit).not.toHaveBeenCalled();
  });

  it('should emit fDeleteSelected for the current selection and stay silent when empty', () => {
    setup();

    keydown('Delete');
    expect(store.fDraggable.fDeleteSelected.emit).not.toHaveBeenCalled();

    keydown('ArrowRight');
    keydown('Delete');
    expect(store.fDraggable.fDeleteSelected.emit).toHaveBeenCalledTimes(1);
    const event = store.fDraggable.fDeleteSelected.emit.calls.mostRecent()
      .args[0] as FDeleteSelectedEvent;
    expect(event.nodeIds).toEqual(['a']);
  });

  it('should honor rebound and disabled action keys', () => {
    setup({ keys: { grab: ['m'], deleteSelected: [] } });
    keydown('ArrowRight');

    keydown('Delete');
    expect(store.fDraggable.fDeleteSelected.emit).not.toHaveBeenCalled();

    keydown('m');
    keyup('m');
    keydown('ArrowRight');
    keydown('m');
    keyup('m');
    expect(store.fDraggable.fMoveNodes.emit).toHaveBeenCalledTimes(1);
  });

  it('should keep the keyboard layer inert without the feature config', () => {
    TestBed.resetTestingModule();
    setupWithoutConfig();

    keydown('ArrowRight');

    expect(selection.fNodeIds).toEqual([]);
    expect(host.hasAttribute('tabindex')).toBeFalse();
    expect(host.hasAttribute('role')).toBeFalse();
  });

  function setupWithoutConfig(): void {
    host = document.createElement('div');
    document.body.appendChild(host);
    nodes = [createNodeStub({ id: 'a', x: 0, y: 0 })];
    nodes.forEach((node) => host.appendChild(node.hostElement));
    selection = { fNodeIds: [], fGroupIds: [], fConnectionIds: [] };
    announcements = [];
    store = {
      flowHost: host,
      nodes: { getAll: () => nodes },
      connections: { getAll: () => [] },
      instances: { get: () => undefined },
      nodesChanges$: new FChannel(),
      connectionsChanges$: new FChannel(),
      fDraggable: {
        disabled: false,
        fMoveNodes: { emit: jasmine.createSpy() },
        fDeleteSelected: { emit: jasmine.createSpy() },
      },
      fCanvas: undefined,
    };
    TestBed.configureTestingModule({
      providers: [
        FA11yController,
        FDraggableDataContext,
        { provide: FComponentsStore, useValue: store },
        { provide: FMediator, useValue: { execute: () => undefined } },
        { provide: FCreateConnectionSession, useValue: { begin: () => false, cancel: () => {} } },
        { provide: FA11yAnnouncer, useValue: { announce: () => {} } },
      ],
    });
    controller = TestBed.inject(FA11yController);
    controller.initialize();
  }
});
