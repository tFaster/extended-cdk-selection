export interface ItemSelectionChange<T> {
  selectedItems: T[];
  addedItems: T[];
  removedItems: T[];
  focusedItem: T;
}
