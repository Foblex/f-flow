// eslint-disable-next-line max-classes-per-file
import { IPoint, PointExtensions, TransformModelExtensions } from '@foblex/2d';
import { EFConnectableSide, FConnectionBase } from '../f-connection-v2';
import { FConnectorBase, FConnectorKind } from '../f-connectors';
import { FCanvasBase } from '../f-canvas';
import { FNodeBase } from '../f-node';
import { FFlowBase } from '../f-flow';
import { ISelectable, F_SELECTED_CLASS } from '../mixins';
import { elementRef, inputSignal, outputEmitterStub, readonlySignal, unsafeCast } from './internal';

interface SelectableOverrides {
  markAsSelected?: () => void;
  unmarkAsSelected?: () => void;
  isSelected?: () => boolean;
}

function createSelectableBehavior(
  hostElement: HTMLElement | SVGElement,
  isInitiallySelected: boolean,
  overrides: SelectableOverrides,
): { markAsSelected(): void; unmarkAsSelected(): void; isSelected(): boolean } {
  let selected = isInitiallySelected;

  const syncClass = () => {
    if (selected) {
      hostElement.classList.add(F_SELECTED_CLASS);
    } else {
      hostElement.classList.remove(F_SELECTED_CLASS);
    }
  };

  syncClass();

  return {
    markAsSelected:
      overrides.markAsSelected ??
      (() => {
        selected = true;
        syncClass();
      }),

    unmarkAsSelected:
      overrides.unmarkAsSelected ??
      (() => {
        selected = false;
        syncClass();
      }),

    isSelected: overrides.isSelected ?? (() => selected),
  };
}

class SelectableFactoryBuilder {
  private _id = 'selectable';
  private _selected = false;
  private _selectionDisabled = false;
  private _hostElement: HTMLElement | SVGElement = document.createElement('div');
  private _overrides: SelectableOverrides = {};

  public id(value: string): this {
    this._id = value;

    return this;
  }

  public selected(value: boolean): this {
    this._selected = value;

    return this;
  }

  public selectionDisabled(value: boolean): this {
    this._selectionDisabled = value;

    return this;
  }

  public host(element: HTMLElement | SVGElement): this {
    this._hostElement = element;

    return this;
  }

  public className(value: string): this {
    this._hostElement.classList.add(value);

    return this;
  }

  public dataset(name: string, value: string): this {
    this._hostElement.dataset[name] = value;

    return this;
  }

  public elementId(value: string): this {
    this._hostElement.id = value;

    return this;
  }

  public onMarkAsSelected(handler: () => void): this {
    this._overrides.markAsSelected = handler;

    return this;
  }

  public onUnmarkAsSelected(handler: () => void): this {
    this._overrides.unmarkAsSelected = handler;

    return this;
  }

  public onIsSelected(handler: () => boolean): this {
    this._overrides.isSelected = handler;

    return this;
  }

  public build(): ISelectable {
    const selectable = createSelectableBehavior(this._hostElement, this._selected, this._overrides);

    return {
      fId: readonlySignal(this._id),
      fSelectionDisabled: readonlySignal(this._selectionDisabled),
      hostElement: this._hostElement,
      markAsSelected: selectable.markAsSelected,
      unmarkAsSelected: selectable.unmarkAsSelected,
      isSelected: selectable.isSelected,
    };
  }
}

class NodeFactoryBuilder {
  private _id = 'node';
  private _parentId: string | null | undefined = null;
  private _selected = false;
  private _selectionDisabled = false;
  private _hostElement: HTMLElement = document.createElement('div');
  private _overrides: SelectableOverrides = {};

  public id(value: string): this {
    this._id = value;

    return this;
  }

  public parent(value: string | null | undefined): this {
    this._parentId = value;

    return this;
  }

  public selected(value: boolean): this {
    this._selected = value;

    return this;
  }

  public selectionDisabled(value: boolean): this {
    this._selectionDisabled = value;

    return this;
  }

  public host(value: HTMLElement): this {
    this._hostElement = value;

    return this;
  }

  public onMarkAsSelected(handler: () => void): this {
    this._overrides.markAsSelected = handler;

    return this;
  }

  public onUnmarkAsSelected(handler: () => void): this {
    this._overrides.unmarkAsSelected = handler;

    return this;
  }

  public onIsSelected(handler: () => boolean): this {
    this._overrides.isSelected = handler;

    return this;
  }

  public build(): FNodeBase {
    const selectable = createSelectableBehavior(this._hostElement, this._selected, this._overrides);

    const node = {
      fId: readonlySignal(this._id),
      fParentId: readonlySignal(this._parentId),
      fSelectionDisabled: readonlySignal(this._selectionDisabled),
      hostElement: this._hostElement,
      connectors: [] as FConnectorBase[],
      markAsSelected: selectable.markAsSelected,
      unmarkAsSelected: selectable.unmarkAsSelected,
      isSelected: selectable.isSelected,
      refresh(): void {
        // No-op for tests.
      },
    };

    return unsafeCast<FNodeBase>(node);
  }
}

class ConnectionFactoryBuilder {
  private _id = 'connection';
  private _outputId = 'output';
  private _inputId = 'input';
  private _selected = false;
  private _selectionDisabled = false;
  private _hostElement: HTMLElement = document.createElement('div');
  private _overrides: SelectableOverrides = {};

  public id(value: string): this {
    this._id = value;

    return this;
  }

  public outputId(value: string): this {
    this._outputId = value;

    return this;
  }

  public inputId(value: string): this {
    this._inputId = value;

    return this;
  }

  public selected(value: boolean): this {
    this._selected = value;

    return this;
  }

  public selectionDisabled(value: boolean): this {
    this._selectionDisabled = value;

    return this;
  }

  public host(value: HTMLElement): this {
    this._hostElement = value;

    return this;
  }

  public onMarkAsSelected(handler: () => void): this {
    this._overrides.markAsSelected = handler;

    return this;
  }

  public onUnmarkAsSelected(handler: () => void): this {
    this._overrides.unmarkAsSelected = handler;

    return this;
  }

  public onIsSelected(handler: () => boolean): this {
    this._overrides.isSelected = handler;

    return this;
  }

  public build(): FConnectionBase {
    const selectable = createSelectableBehavior(this._hostElement, this._selected, this._overrides);

    const connection = {
      fId: readonlySignal(this._id),
      fOutputId: readonlySignal(this._outputId),
      fInputId: readonlySignal(this._inputId),
      fSelectionDisabled: readonlySignal(this._selectionDisabled),
      hostElement: this._hostElement,
      markAsSelected: selectable.markAsSelected,
      unmarkAsSelected: selectable.unmarkAsSelected,
      isSelected: selectable.isSelected,
    };

    return unsafeCast<FConnectionBase>(connection);
  }
}

class CanvasFactoryBuilder {
  private _hostElement: HTMLElement = document.createElement('div');
  private _groupsContainer: HTMLElement = document.createElement('div');
  private _nodesContainer: HTMLElement = document.createElement('div');
  private _connectionsContainer: HTMLElement = document.createElement('div');
  private _debounce = 0;

  public host(value: HTMLElement): this {
    this._hostElement = value;

    return this;
  }

  public groupsContainer(value: HTMLElement): this {
    this._groupsContainer = value;

    return this;
  }

  public nodesContainer(value: HTMLElement): this {
    this._nodesContainer = value;

    return this;
  }

  public connectionsContainer(value: HTMLElement): this {
    this._connectionsContainer = value;

    return this;
  }

  public debounce(value: number): this {
    this._debounce = value;

    return this;
  }

  public build(): FCanvasBase {
    const transform = TransformModelExtensions.default();

    const canvas = {
      hostElement: this._hostElement,
      fCanvasChange: outputEmitterStub(),
      fGroupsContainer: readonlySignal(elementRef(this._groupsContainer)),
      fNodesContainer: readonlySignal(elementRef(this._nodesContainer)),
      fConnectionsContainer: readonlySignal(elementRef(this._connectionsContainer)),
      debounce: readonlySignal(this._debounce),
      transform,
      redraw(): void {
        // No-op for tests.
      },
      redrawWithAnimation(): void {
        // No-op for tests.
      },
      setScale(scale: number, toPosition: IPoint): void {
        transform.scale = scale;
        transform.scaledPosition = toPosition;
      },
      resetScale(): void {
        transform.scale = 1;
        transform.scaledPosition = PointExtensions.initialize();
      },
    };

    return unsafeCast<FCanvasBase>(canvas);
  }
}

class FlowFactoryBuilder {
  private _id = 'flow';
  private _hostElement: HTMLElement = document.createElement('div');

  public id(value: string): this {
    this._id = value;

    return this;
  }

  public host(value: HTMLElement): this {
    this._hostElement = value;

    return this;
  }

  public build(): FFlowBase {
    const flow = {
      fId: inputSignal(this._id),
      hostElement: this._hostElement,
      fLoaded: outputEmitterStub<string>(),
    };

    return unsafeCast<FFlowBase>(flow);
  }
}

class ConnectorFactoryBuilder {
  private _id = 'connector';
  private _kind: FConnectorKind = 'input';
  private _nodeId = 'node';
  private _nodeHost: HTMLElement | SVGElement = document.createElement('div');
  private _hostElement: HTMLElement | SVGElement = document.createElement('div');
  private _disabled = false;
  private _canBeConnected = true;

  public id(value: string): this {
    this._id = value;

    return this;
  }

  public kind(value: FConnectorKind): this {
    this._kind = value;

    return this;
  }

  public nodeId(value: string): this {
    this._nodeId = value;

    return this;
  }

  public nodeHost(value: HTMLElement | SVGElement): this {
    this._nodeHost = value;

    return this;
  }

  public host(value: HTMLElement | SVGElement): this {
    this._hostElement = value;

    return this;
  }

  public disabled(value: boolean): this {
    this._disabled = value;

    return this;
  }

  public canBeConnected(value: boolean): this {
    this._canBeConnected = value;

    return this;
  }

  public build(): FConnectorBase {
    let isConnected = false;
    const toConnector: FConnectorBase[] = [];
    const hostElement = this._hostElement;

    const connector = {
      kind: this._kind,
      fId: readonlySignal(this._id),
      fNodeId: this._nodeId,
      fNodeHost: this._nodeHost,
      disabled: readonlySignal(this._disabled),
      hostElement,
      canBeConnected: this._canBeConnected,
      toConnector,
      isSelfConnectable: true,
      fConnectableSide: EFConnectableSide.AUTO,
      userFConnectableSide: EFConnectableSide.AUTO,
      get isConnected(): boolean {
        return isConnected;
      },
      isContains(element: HTMLElement | SVGElement): boolean {
        return hostElement.contains(element);
      },
      setConnected(targetConnector: FConnectorBase): void {
        isConnected = true;
        toConnector.push(targetConnector);
      },
      resetConnected(): void {
        isConnected = false;
        toConnector.length = 0;
      },
    };

    return unsafeCast<FConnectorBase>(connector);
  }
}

export function selectableFactory(): SelectableFactoryBuilder {
  return new SelectableFactoryBuilder();
}

export function nodeFactory(): NodeFactoryBuilder {
  return new NodeFactoryBuilder();
}

export function connectionFactory(): ConnectionFactoryBuilder {
  return new ConnectionFactoryBuilder();
}

export function canvasFactory(): CanvasFactoryBuilder {
  return new CanvasFactoryBuilder();
}

export function flowFactory(): FlowFactoryBuilder {
  return new FlowFactoryBuilder();
}

export function connectorFactory(): ConnectorFactoryBuilder {
  return new ConnectorFactoryBuilder();
}
