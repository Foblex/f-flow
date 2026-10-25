import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserService, F_WINDOW, IWindowService, PlatformService } from '@foblex/flow';

describe('BrowserService.toPixels', () => {
  it('resolves rem units through the injected window service, not the global one', () => {
    const getComputedStyleSpy = jasmine
      .createSpy('getComputedStyle')
      .and.returnValue({ fontSize: '10px' } as CSSStyleDeclaration);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: F_WINDOW,
          useValue: { getComputedStyle: getComputedStyleSpy } as Partial<IWindowService>,
        },
      ],
    });

    const browser = TestBed.inject(BrowserService);
    const result = browser.toPixels('2rem', 100, 100, '16px');

    expect(result).toBe(20);
    expect(getComputedStyleSpy).toHaveBeenCalledOnceWith(document.documentElement);
  });
});

describe('PlatformService.getOS', () => {
  it('returns undefined on the server instead of touching navigator', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    const platform = TestBed.inject(PlatformService);

    expect(platform.isBrowser).toBe(false);
    expect(platform.getOS()).toBeUndefined();
  });
});

describe('BrowserService.toPixels em handling', () => {
  it('still resolves plain em units against the element font size', () => {
    TestBed.configureTestingModule({});
    const browser = TestBed.inject(BrowserService);

    expect(browser.toPixels('2em', 100, 100, '16px')).toBe(32);
  });
});
