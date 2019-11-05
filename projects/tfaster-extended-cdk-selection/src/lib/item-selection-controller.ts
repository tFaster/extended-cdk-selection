import { SelectionModel } from '@angular/cdk/collections';
import { ItemSelectionModel } from './item-selection-model';

export class ItemSelectionController<T> {

  private readonly _itemSelectionModel: ItemSelectionModel<T>;

  constructor(private _dataSource: T[] = [],
              identityProperty: string = null,
              cdkSelectionModel: SelectionModel<T> = new SelectionModel<T>(true)) {
    this._itemSelectionModel = new ItemSelectionModel<T>(_dataSource, identityProperty, cdkSelectionModel);
  }


  public get selectionModel(): ItemSelectionModel<T> {
    return this._itemSelectionModel;
  }

  public updateDataSource(dataSource: T[]): void {
    this._dataSource = dataSource;
    this._itemSelectionModel.updateItemList(dataSource);
  }

  public handleClickEvent(itemData: T, mouseEvent: MouseEvent): void {
    this._handleItemSelection(itemData, mouseEvent.ctrlKey, mouseEvent.shiftKey, false);
  }

  public handleKeyboardEvent(event: KeyboardEvent): boolean {
    let eventHandled = false;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        eventHandled = this._handleKeyboardArrowEvent(event);
        break;
      case ' ':
        eventHandled = this._handleSpaceKeyEvent(event);
        break;
      case 'a':
        if (event.ctrlKey) {
          eventHandled = this._itemSelectionModel.selectAll();
        }
        break;
    }
    if (eventHandled) {
      event.preventDefault();
    }
    return eventHandled;
  }

  private _handleKeyboardArrowEvent(event: KeyboardEvent): boolean {
    const focusedRowIndex: number = this._dataSource.indexOf(this._itemSelectionModel.focusedItem);
    const rowIndex: number = event.key === 'ArrowDown' ? focusedRowIndex + 1 : focusedRowIndex - 1;
    const rowData: T = this._dataSource[rowIndex];
    if (rowData) {
      this._handleItemSelection(rowData, event.ctrlKey, event.shiftKey, true);
      return true;
    }
    return false;
  }

  private _handleSpaceKeyEvent(event: KeyboardEvent): boolean {
    if (this._itemSelectionModel.focusedItem) {
      this._handleItemSelection(this._itemSelectionModel.focusedItem, event.ctrlKey, event.shiftKey, false);
      return true;
    }
    return false;
  }

  private _handleItemSelection(itemData: T, ctrlKey: boolean, shiftKey: boolean, isKeyboardArrowSelection: boolean): void {
    if (ctrlKey) {
      if (shiftKey) {
        this._itemSelectionModel.selectRangeFromFocusedItem(itemData, false);
      } else {
        if (isKeyboardArrowSelection) {
          this._itemSelectionModel.focusedItem = itemData;
        } else {
          this._itemSelectionModel.toggleItem(itemData);
        }
      }
    } else if (shiftKey) {
      this._itemSelectionModel.selectRangeFromFocusedItem(itemData, true);
    } else {
      if (this._itemSelectionModel.isOnlySelectedItem(itemData)) {
        this._itemSelectionModel.focusedItem = itemData;
      } else {
        this._itemSelectionModel.selectItem(itemData, true);
      }
    }
  }
}
