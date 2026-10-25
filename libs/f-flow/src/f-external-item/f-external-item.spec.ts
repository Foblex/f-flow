import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FExternalItem, FExternalItemBase, FExternalItemService } from '@foblex/flow';

@Component({
  standalone: true,
  imports: [FExternalItem],
  template: `
    @if (visible) {
      <div fExternalItem fExternalItemId="palette-item">item</div>
    }
  `,
})
class ExternalItemHost {
  public visible = true;
}

describe('FExternalItem registration lifecycle', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ExternalItemHost] }).compileComponents();
  });

  it('removes a destroyed item from the service instead of retaining it', () => {
    const fixture = TestBed.createComponent(ExternalItemHost);
    fixture.detectChanges();

    const service = TestBed.inject(FExternalItemService);
    expect(service.items().length).toBe(1);

    // Destroying the view must release the item (issue #335): a retained item keeps
    // the whole destroyed view reachable through preview/DestroyRef/LView.
    fixture.componentInstance.visible = false;
    fixture.detectChanges();

    expect(service.items().length).toBe(0);
  });

  it('re-registers on re-create and releases again on the next destroy', () => {
    const fixture = TestBed.createComponent(ExternalItemHost);
    fixture.detectChanges();
    const service = TestBed.inject(FExternalItemService);

    fixture.componentInstance.visible = false;
    fixture.detectChanges();
    fixture.componentInstance.visible = true;
    fixture.detectChanges();
    expect(service.items().length).toBe(1);

    fixture.componentInstance.visible = false;
    fixture.detectChanges();
    expect(service.items().length).toBe(0);
  });
});

describe('FExternalItemService.remove', () => {
  function fakeItem(host: HTMLElement): FExternalItemBase {
    return { hostElement: host } as FExternalItemBase;
  }

  it('ignores an item whose host was already taken over by a replacement', () => {
    const service = new FExternalItemService();
    const host = document.createElement('div');
    const original = fakeItem(host);
    const replacement = fakeItem(host);

    service.register(original);
    service.register(replacement);
    service.remove(original);

    expect(service.getByHost(host)).toBe(replacement);
    expect(service.items().length).toBe(1);
  });
});
