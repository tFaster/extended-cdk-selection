import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { ItemSelectionChange } from './item-selection-change';

export class ItemSelectionModel<T> {

  private _focusedItem: T;
  private _rangeSelectStartItem: T;

  private readonly _selectionChange$ = new Subject<ItemSelectionChange<T>>();
  private readonly _focusChange$ = new Subject<T>();

  public readonly selectionChange$ = this._selectionChange$.asObservable();
  public readonly focusChange$ = this._focusChange$.asObservable();

  constructor(private _itemList: T[],
              private _identityProperty: string = undefined,
              private _cdkSelectionModel: SelectionModel<T> = new SelectionModel<T>()) {
  }

  updateItemList(itemList: T[]): void {
    this._itemList = itemList;
    if (this._identityProperty) {
      this._reselectChangedSourceData();
    }
  }

  public isFocused(itemData: T): boolean {
    return itemData === this._focusedItem;
  };

  public isSelected(itemData: T): boolean {
    return this._cdkSelectionModel.isSelected(itemData);
  };

  public isAllSelected(): boolean {
    return this.selectedItems.length === this._itemList.length;
  };

  public selectAll(): boolean {
    if (this._itemList.length !== this.selectedItems.length) {
      const addedItems: T[] = [...this._itemList];
      this.selectedItems.forEach((selectedItem: T) => {
        addedItems.splice(addedItems.indexOf(selectedItem), 1);
      });
      this._cdkSelectionModel.select(...this._itemList);
      this._notifySelectionChange(addedItems, []);
      return true;
    }
    return false;
  };

  public clear(): boolean {
    if (this.selectedItems.length > 0) {
      this._cdkSelectionModel.clear();
      return true;
    }
    return false;
  }

  public get selectedItems(): T[] {
    return this._cdkSelectionModel.selected;
  };

  public set selectedItems(newSelection: T[]) {
    const currentSelection = this.selectedItems;
    const addedItems: T[] = newSelection.reduce((acc, item: T) => {
      if (!currentSelection.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, []);
    const removedItems: T[] = currentSelection.reduce((acc, item: T) => {
      if (!newSelection.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, []);
    this._cdkSelectionModel.clear();
    this._cdkSelectionModel.select(...newSelection);
    this._notifySelectionChange(addedItems, removedItems);
  }

  public get focusedItem(): T {
    return this._focusedItem;
  };

  public set focusedItem(itemData: T) {
    if (!this.isFocused(itemData)) {
      this._focusedItem = itemData;
      this._focusChange$.next(this._focusedItem);
    }
  };

  public toggleItem(itemData: T): void {
    this.focusedItem = itemData;
    this._rangeSelectStartItem = itemData;
    this._cdkSelectionModel.toggle(itemData);
    const isAdded: boolean = this.selectedItems.includes(itemData);
    const addedItems: T[] = isAdded ? [itemData] : [];
    const removedItems: T[] = isAdded ? [] : [itemData];
    this._notifySelectionChange(addedItems, removedItems);
  };

  public selectItem(itemData: T, clearOthers: boolean): void {
    this.focusedItem = itemData;
    this._rangeSelectStartItem = itemData;
    const currentSelection: T[] = [...this.selectedItems];
    let removedItems: T[] = [];
    const indexOfItemInSelection: number = this.selectedItems.indexOf(itemData);
    if (indexOfItemInSelection !== -1) {
      if (clearOthers) {
        removedItems = currentSelection;
        removedItems.splice(indexOfItemInSelection, 1);
        this._cdkSelectionModel.deselect(...removedItems);
        this._notifySelectionChange([itemData], removedItems);
      }
    } else {
      if (clearOthers) {
        this._cdkSelectionModel.clear();
        removedItems = currentSelection;
      }
      this._cdkSelectionModel.select(itemData);
      this._notifySelectionChange([itemData], removedItems);
    }
  };

  public isOnlySelectedItem(itemData: T): boolean {
    return this.selectedItems.length === 1 && this.selectedItems[0] === itemData;
  }

  public selectRangeFromFocusedItem(itemData: T, clearOthers: boolean): void {

    const rangeSelectStartItemIndex: number = this._itemList.indexOf(this._rangeSelectStartItem);
    const itemDataIndex: number = this._itemList.indexOf(itemData);
    this.focusedItem = itemData;
    this._selectRange(itemDataIndex, rangeSelectStartItemIndex, clearOthers);
  };

  private _selectRange(itemDataIndex: number,
                       rangeStartIndex: number,
                       clearOthers: boolean = false): void {
    const currentSelection: T[] = this.selectedItems;
    const rangeTopIndex = Math.min(itemDataIndex, rangeStartIndex);
    const rangeBottomIndex = Math.max(itemDataIndex, rangeStartIndex);
    let removedItems: T[] = [];
    const itemsInRange: T[] = [];
    const addedItems: T[] = [];

    for (let i = rangeTopIndex; i <= rangeBottomIndex; i++) {
      const item: T = this._itemList[i];
      itemsInRange.push(item);
      if (!currentSelection.includes(item)) {
        addedItems.push(item);
      }
    }

    if (clearOthers) {
      removedItems = currentSelection.reduce((itemsNotInRange: T[], item: T) => {
        if (!itemsInRange.includes(item)) {
          itemsNotInRange.push(item);
        }
        return itemsNotInRange;
      }, []);
      this._cdkSelectionModel.clear();
    }
    this._cdkSelectionModel.select(...itemsInRange);
    this._notifySelectionChange(addedItems, removedItems);
  }

  private _reselectChangedSourceData(): void {
    const oldSelectedItems: T[] = this._cdkSelectionModel.selected;
    const notFoundItems: T[] = [];
    const newSelectedItems: T[] = oldSelectedItems.reduce((acc: T[], oldItem: T) => {
      const foundNewItem: T = this._itemList.find((newItem: T) => {
        return newItem[this._identityProperty] === oldItem[this._identityProperty];
      });
      if (foundNewItem) {
        acc.push(foundNewItem);
      } else {
        notFoundItems.push(oldItem);
      }
      return acc;
    }, []);
    this._cdkSelectionModel.clear();
    this._cdkSelectionModel.select(...newSelectedItems);
    if (notFoundItems.length > 0) {
      this._notifySelectionChange([], notFoundItems);
    }

    if (this.focusedItem) {
      this.focusedItem = this._itemList.find((newItem: T) => {
        return this.focusedItem[this._identityProperty] === newItem[this._identityProperty];
      }) || this._itemList[0];
    }

    if (this._rangeSelectStartItem) {
      this._rangeSelectStartItem = this._itemList.find((newItem: T) => {
        return this._rangeSelectStartItem[this._identityProperty] === newItem[this._identityProperty];
      }) || this._itemList[0];
    }

  }

  private _notifySelectionChange(addedItems: T[], removedItems: T[]): void {
    this._selectionChange$.next({
      addedItems: addedItems,
      removedItems: removedItems,
      selectedItems: this.selectedItems,
      focusedItem: this._focusedItem
    });
  }

}
