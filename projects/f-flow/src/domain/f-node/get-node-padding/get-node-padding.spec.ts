import { TestBed } from '@angular/core/testing';
import { GetNodePaddingRequest } from './get-node-padding.request';
import { FMediator } from '@foblex/mediator';
import { GetNodePadding } from './get-node-padding';
import { setupTestModule } from '../../test-setup';
import { RectExtensions, IRect } from '@foblex/2d';
import { signal, Signal } from '@angular/core';
import { FNodeBase } from '../../../f-node';
import { IHasHostElement } from '../../../i-has-host-element';

describe('GetNodePadding', () => {
  let fMediator: FMediator;

  beforeEach(() => {
    setupTestModule([GetNodePadding]);
    fMediator = TestBed.inject(FMediator);
  });

  function createMockNode(options: {
    includePadding: boolean;
    childrenArea?: IHasHostElement | null;
    paddingLeft?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
  }): Partial<FNodeBase> {
    const hostElement = document.createElement('div');
    hostElement.style.padding = '10px';
    if (options.paddingLeft) hostElement.style.paddingLeft = options.paddingLeft;
    if (options.paddingTop) hostElement.style.paddingTop = options.paddingTop;
    if (options.paddingRight) hostElement.style.paddingRight = options.paddingRight;
    if (options.paddingBottom) hostElement.style.paddingBottom = options.paddingBottom;
    document.body.appendChild(hostElement);

    return {
      hostElement,
      fIncludePadding: signal(options.includePadding) as Signal<boolean>,
      childrenArea: options.childrenArea ?? null,
    };
  }

  function createRect(x: number, y: number, width: number, height: number): IRect {
    return RectExtensions.initialize(x, y, width, height);
  }

  it('should return [0, 0, 0, 0] when fIncludePadding is false', () => {
    const mockNode = createMockNode({ includePadding: false });
    const rect = createRect(0, 0, 100, 100);

    const result = fMediator.execute<[number, number, number, number]>(
      new GetNodePaddingRequest(mockNode as FNodeBase, rect),
    );

    expect(result).toEqual([0, 0, 0, 0]);
    mockNode.hostElement?.remove();
  });

  it('should return CSS padding values when fIncludePadding is true and no childrenArea', () => {
    const mockNode = createMockNode({
      includePadding: true,
      paddingLeft: '10px',
      paddingTop: '20px',
      paddingRight: '30px',
      paddingBottom: '40px',
    });
    const rect = createRect(0, 0, 100, 100);

    const result = fMediator.execute<[number, number, number, number]>(
      new GetNodePaddingRequest(mockNode as FNodeBase, rect),
    );

    expect(result).toEqual([10, 20, 30, 40]);
    mockNode.hostElement?.remove();
  });

  it('should return children area offset when childrenArea is set', () => {
    const hostElement = document.createElement('div');
    hostElement.style.position = 'absolute';
    hostElement.style.left = '0px';
    hostElement.style.top = '0px';
    hostElement.style.width = '200px';
    hostElement.style.height = '200px';
    document.body.appendChild(hostElement);

    const childrenAreaElement = document.createElement('div');
    childrenAreaElement.style.position = 'absolute';
    childrenAreaElement.style.left = '20px';
    childrenAreaElement.style.top = '30px';
    childrenAreaElement.style.width = '160px';
    childrenAreaElement.style.height = '150px';
    hostElement.appendChild(childrenAreaElement);

    const mockChildrenArea: IHasHostElement = {
      hostElement: childrenAreaElement,
    };

    const mockNode: Partial<FNodeBase> = {
      hostElement,
      fIncludePadding: signal(true) as Signal<boolean>,
      childrenArea: mockChildrenArea,
    };

    const rect = createRect(0, 0, 200, 200);

    const result = fMediator.execute<[number, number, number, number]>(
      new GetNodePaddingRequest(mockNode as FNodeBase, rect),
    );

    // left = childrenAreaRect.left - nodeRect.left = 20 - 0 = 20
    // top = childrenAreaRect.top - nodeRect.top = 30 - 0 = 30
    // right = nodeRect.right - childrenAreaRect.right = 200 - 180 = 20
    // bottom = nodeRect.bottom - childrenAreaRect.bottom = 200 - 180 = 20
    expect(result[0]).toBe(20); // left
    expect(result[1]).toBe(30); // top
    expect(result[2]).toBe(20); // right
    expect(result[3]).toBe(20); // bottom

    hostElement.remove();
  });

  it('should use CSS padding when childrenArea is null', () => {
    const mockNode = createMockNode({
      includePadding: true,
      childrenArea: null,
      paddingLeft: '0px',
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
    });
    const rect = createRect(0, 0, 100, 100);

    const result = fMediator.execute<[number, number, number, number]>(
      new GetNodePaddingRequest(mockNode as FNodeBase, rect),
    );

    expect(result).toEqual([0, 0, 0, 0]);
    mockNode.hostElement?.remove();
  });
});
