import { DestroyRef, inject, Injectable, NgZone } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';
import { FNodeSizeRegistry } from './f-node-size-registry';
import { FVisibilityService } from './f-visibility.service';
import { FMeasurementPipeline } from './f-measurement-pipeline';
import {
  F_VIRTUALIZATION_CONFIG,
  F_VIRTUALIZATION_DEFAULT_CONFIG,
  IFVirtualizationConfig,
} from './f-virtualization-config';
import { FComponentsStore } from '../f-storage';

@Injectable()
export class FVirtualizationService {
  private readonly _store = inject(FComponentsStore);
  private readonly _sizeRegistry = inject(FNodeSizeRegistry);
  private readonly _visibility = inject(FVisibilityService);
  private readonly _pipeline = inject(FMeasurementPipeline);
  private readonly _browser = inject(BrowserService);
  private readonly _ngZone = inject(NgZone);
  private readonly _destroyRef = inject(DestroyRef);

  private _config: IFVirtualizationConfig;

  private readonly _nodeElements = new Map<string, HTMLElement>();
  private _previousVisibleSet = new Set<string>();
  private _rafId: number | null = null;
  private _initialized = false;

  constructor() {
    let config: IFVirtualizationConfig | null = null;
    try {
      config = inject(F_VIRTUALIZATION_CONFIG, { optional: true }) ?? null;
    } catch {
      config = null;
    }
    this._config = config ?? { ...F_VIRTUALIZATION_DEFAULT_CONFIG };
    this._sizeRegistry.setDefaultEstimatedSize(this._config.estimatedSize);
    this._visibility.setBufferPx(this._config.bufferPx);
    this._pipeline.setBatchSize(this._config.measureBatchSize);

    this._destroyRef.onDestroy(() => this.destroy());
  }

  public get enabled(): boolean {
    return this._config.enabled;
  }

  public get enableContainmentCSS(): boolean {
    return this._config.enableContainmentCSS;
  }

  public get estimatedSize(): { width: number; height: number } {
    return this._config.estimatedSize;
  }

  /**
   * Register a node element for virtualization tracking.
   */
  public registerNode(nodeId: string, element: HTMLElement): void {
    if (!this._config.enabled) {
      return;
    }
    this._sizeRegistry.register(nodeId);
    this._nodeElements.set(nodeId, element);
  }

  /**
   * Unregister a node element from virtualization tracking.
   */
  public unregisterNode(nodeId: string): void {
    if (!this._config.enabled) {
      return;
    }
    this._sizeRegistry.unregister(nodeId);
    this._nodeElements.delete(nodeId);
    this._pipeline.unobserveElement(nodeId);
  }

  /**
   * Called by the canvas/flow after transform changes to update visible set.
   */
  public updateVisibility(): void {
    if (!this._config.enabled || !this._browser.isBrowser()) {
      return;
    }

    const canvas = this._store.fCanvas;
    const flow = this._store.fFlow;
    if (!canvas || !flow) {
      return;
    }

    const transform = canvas.transform;
    const scale = transform.scale;
    const position = transform.position;

    // Viewport in world coordinates
    const flowRect = flow.hostElement.getBoundingClientRect();
    const viewportRect = {
      x: -position.x / scale,
      y: -position.y / scale,
      width: flowRect.width / scale,
      height: flowRect.height / scale,
    };

    // Build node positions map
    const nodePositions = new Map<string, IPoint>();
    this._store.nodes.getAll().forEach((node) => {
      nodePositions.set(node.fId(), node._position);
    });

    this._pipeline.setScale(scale);

    const visibleSet = this._visibility.computeVisibility(viewportRect, nodePositions, scale);

    // Apply visibility changes
    this._applyVisibilityChanges(visibleSet);

    this._previousVisibleSet = new Set(visibleSet);
    this._initialized = true;
  }

  private _applyVisibilityChanges(visibleSet: Set<string>): void {
    // Hide nodes that are no longer visible
    this._previousVisibleSet.forEach((nodeId) => {
      if (!visibleSet.has(nodeId)) {
        this._hideNode(nodeId);
      }
    });

    // Show nodes that are newly visible
    visibleSet.forEach((nodeId) => {
      if (!this._previousVisibleSet.has(nodeId)) {
        this._showNode(nodeId);
      }
    });
  }

  private _hideNode(nodeId: string): void {
    const element = this._nodeElements.get(nodeId);
    if (element) {
      element.style.display = 'none';
      this._pipeline.unobserveElement(nodeId);
    }
  }

  private _showNode(nodeId: string): void {
    const element = this._nodeElements.get(nodeId);
    if (element) {
      element.style.display = '';
      // Enqueue measurement for newly visible nodes
      this._pipeline.enqueue(nodeId, element);
      this._pipeline.observeElement(nodeId, element);
    }
  }

  /**
   * Force a node to remain visible (e.g., during drag/connect).
   */
  public forceVisible(nodeId: string): void {
    this._visibility.forceVisible(nodeId);
    this._showNode(nodeId);
  }

  /**
   * Remove forced visibility for a node.
   */
  public removeForceVisible(nodeId: string): void {
    this._visibility.removeForceVisible(nodeId);
  }

  /**
   * Initial visibility pass for all registered nodes.
   * Should be called once after the flow is loaded.
   */
  public initialize(): void {
    if (!this._config.enabled || this._initialized) {
      return;
    }

    // Initially hide all registered nodes before computing visibility
    this._nodeElements.forEach((element, _nodeId) => {
      element.style.display = 'none';
    });
    this._previousVisibleSet.clear();

    this.updateVisibility();
  }

  /**
   * Check if a connection should be visible based on its endpoint nodes.
   */
  public isConnectionVisible(
    outputNodeId: string | undefined,
    inputNodeId: string | undefined,
  ): boolean {
    if (!this._config.enabled) {
      return true;
    }
    const visibleSet = this._visibility.getVisibleNodeIds();

    return (
      (outputNodeId !== undefined && visibleSet.has(outputNodeId)) ||
      (inputNodeId !== undefined && visibleSet.has(inputNodeId))
    );
  }

  /**
   * Apply CSS containment styles to a node element.
   */
  public applyContainmentCSS(element: HTMLElement): void {
    if (!this._config.enabled || !this._config.enableContainmentCSS) {
      return;
    }
    const est = this._config.estimatedSize;
    element.style.contain = 'layout paint';
    element.style.contentVisibility = 'auto';
    element.style.containIntrinsicSize = `${est.width}px ${est.height}px`;
  }

  /**
   * Remove CSS containment styles from a node element.
   */
  public removeContainmentCSS(element: HTMLElement): void {
    element.style.contain = '';
    element.style.contentVisibility = '';
    element.style.containIntrinsicSize = '';
  }

  public destroy(): void {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._pipeline.clear();
    this._nodeElements.clear();
    this._previousVisibleSet.clear();
    this._sizeRegistry.clear();
  }
}
