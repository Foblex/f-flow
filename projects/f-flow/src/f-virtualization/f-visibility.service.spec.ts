import { FVisibilityService } from './f-visibility.service';
import { FNodeSizeRegistry } from './f-node-size-registry';
import { TestBed } from '@angular/core/testing';

describe('FVisibilityService', () => {
  let service: FVisibilityService;
  let sizeRegistry: FNodeSizeRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FNodeSizeRegistry, FVisibilityService],
    });
    sizeRegistry = TestBed.inject(FNodeSizeRegistry);
    service = TestBed.inject(FVisibilityService);
  });

  it('should return empty set when no nodes exist', () => {
    const viewport = { x: 0, y: 0, width: 1000, height: 800 };
    const result = service.computeVisibility(viewport, new Map(), 1);

    expect(result.size).toBe(0);
  });

  it('should include nodes inside viewport', () => {
    sizeRegistry.register('node-1');
    const positions = new Map([['node-1', { x: 100, y: 100 }]]);
    const viewport = { x: 0, y: 0, width: 1000, height: 800 };

    const result = service.computeVisibility(viewport, positions, 1);

    expect(result.has('node-1')).toBeTrue();
  });

  it('should exclude nodes outside viewport', () => {
    sizeRegistry.register('node-1');
    service.setBufferPx(0);
    const positions = new Map([['node-1', { x: 5000, y: 5000 }]]);
    const viewport = { x: 0, y: 0, width: 1000, height: 800 };

    const result = service.computeVisibility(viewport, positions, 1);

    expect(result.has('node-1')).toBeFalse();
  });

  it('should include nodes in buffer zone', () => {
    sizeRegistry.register('node-1');
    service.setBufferPx(300);
    // Node at x=1100 is outside 1000 viewport but within 300px buffer
    const positions = new Map([['node-1', { x: 1100, y: 100 }]]);
    const viewport = { x: 0, y: 0, width: 1000, height: 800 };

    const result = service.computeVisibility(viewport, positions, 1);

    expect(result.has('node-1')).toBeTrue();
  });

  it('should always include forced-visible nodes', () => {
    sizeRegistry.register('node-1');
    service.setBufferPx(0);
    service.forceVisible('node-1');
    const positions = new Map([['node-1', { x: 5000, y: 5000 }]]);
    const viewport = { x: 0, y: 0, width: 1000, height: 800 };

    const result = service.computeVisibility(viewport, positions, 1);

    expect(result.has('node-1')).toBeTrue();
  });

  it('should remove force-visible and exclude if out of viewport', () => {
    sizeRegistry.register('node-1');
    service.setBufferPx(0);
    service.forceVisible('node-1');
    service.removeForceVisible('node-1');
    const positions = new Map([['node-1', { x: 5000, y: 5000 }]]);
    const viewport = { x: 0, y: 0, width: 1000, height: 800 };

    const result = service.computeVisibility(viewport, positions, 1);

    expect(result.has('node-1')).toBeFalse();
  });

  it('should handle multiple nodes correctly', () => {
    sizeRegistry.register('visible-1');
    sizeRegistry.register('visible-2');
    sizeRegistry.register('hidden-1');
    service.setBufferPx(0);

    const positions = new Map([
      ['visible-1', { x: 100, y: 100 }],
      ['visible-2', { x: 500, y: 400 }],
      ['hidden-1', { x: 5000, y: 5000 }],
    ]);
    const viewport = { x: 0, y: 0, width: 1000, height: 800 };

    const result = service.computeVisibility(viewport, positions, 1);

    expect(result.has('visible-1')).toBeTrue();
    expect(result.has('visible-2')).toBeTrue();
    expect(result.has('hidden-1')).toBeFalse();
  });

  it('should use measured size when available for culling', () => {
    sizeRegistry.register('node-1');
    sizeRegistry.setMeasuredSize('node-1', { width: 50, height: 50 });
    service.setBufferPx(0);

    // Node at x=1060 with width=50: right edge at 1110, left edge at 1060
    // Viewport right edge at 1000 → should be excluded
    const positions = new Map([['node-1', { x: 1060, y: 100 }]]);
    const viewport = { x: 0, y: 0, width: 1000, height: 800 };

    const result = service.computeVisibility(viewport, positions, 1);

    expect(result.has('node-1')).toBeFalse();
  });

  it('should account for scale in buffer calculation', () => {
    sizeRegistry.register('node-1');
    service.setBufferPx(200);

    // At scale=0.5, buffer in world coords = 200/0.5 = 400
    // Node at x=1300 with default width=200: left edge at 1300
    // Viewport 0-1000 + 400 buffer = -400 to 1400 → should be visible
    const positions = new Map([['node-1', { x: 1300, y: 100 }]]);
    const viewport = { x: 0, y: 0, width: 1000, height: 800 };

    const result = service.computeVisibility(viewport, positions, 0.5);

    expect(result.has('node-1')).toBeTrue();
  });

  it('should track visibility state via isVisible', () => {
    sizeRegistry.register('node-1');
    const positions = new Map([['node-1', { x: 100, y: 100 }]]);
    const viewport = { x: 0, y: 0, width: 1000, height: 800 };

    service.computeVisibility(viewport, positions, 1);

    expect(service.isVisible('node-1')).toBeTrue();
  });

  it('should clear all forced visible IDs', () => {
    service.forceVisible('node-1');
    service.forceVisible('node-2');
    service.clearForceVisible();

    expect(service.getForcedVisibleIds().size).toBe(0);
  });
});
