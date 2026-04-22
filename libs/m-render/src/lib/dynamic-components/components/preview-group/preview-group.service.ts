import { Injectable } from '@angular/core';
import { PreviewCardBase } from './components/preview-card';

@Injectable()
export class PreviewGroupService {

  private _cards: PreviewCardBase[] = [];
  private _originalOrder: Map<HTMLElement, Node[]> | null = null;

  public add(card: PreviewCardBase): void {
    this._cards.push(card);
  }

  public remove(card: PreviewCardBase): void {
    this._cards = this._cards.filter(preview => preview !== card);
  }

  public sortByDate(sort: boolean): void {
    if (sort) {
      this._applyByDateOrder();
    } else {
      this._applyOriginalOrder();
    }
  }

  private _setOriginalOrder(): void {
    this._originalOrder = new Map();
    this._cards.forEach((x) => {
      const parentElement = x.hostElement.parentElement;
      if (parentElement) {
        const childrenArray = Array.from(parentElement.children);
        this._originalOrder!.set(parentElement, childrenArray);
      }
    });
  }

  private _getOrderByDate(): PreviewCardBase[] {
    return this._cards
      .slice()
      .sort((a, b) => {
        const dateA = a.date ? a.date.getTime() : Number.MIN_SAFE_INTEGER;
        const dateB = b.date ? b.date.getTime() : Number.MIN_SAFE_INTEGER;
        return dateB - dateA;
      });
  }

  private _applyByDateOrder(): void {
    this._setOriginalOrder();
    this._getOrderByDate().forEach((x) => {
      const parent = x.hostElement.parentElement;
      parent?.appendChild(x.hostElement);
    });
  }

  private _applyOriginalOrder(): void {
    this._originalOrder!.forEach((originalChildren, parentElement) => {
      originalChildren.forEach(child => parentElement.appendChild(child));
    });
  }

  public filterBy(filterKey: string, _allKey: string): void {
    this._resetLastActiveFilter();

    if (filterKey === _allKey) {
      return;
    }
    this._cards.forEach((x) => {
      if (x.filterKey !== filterKey) {
        x.hostElement.style.display = 'none';
      }
    });
  }

  private _resetLastActiveFilter(): void {
    this._cards.forEach((x) => {
      x.hostElement.style.display = 'block';
    });
  }
}
