import { ItemSelectionModel } from './item-selection-model';
import { fakeAsync } from '@angular/core/testing';
import { ItemSelectionChange } from './item-selection-change';
import { SelectionModel } from '@angular/cdk/collections';

interface TestItem {
  id: string;
}

describe('ItemSelectionModel (multi select)', () => {

  const itemA: TestItem = {id: 'item_A'};
  const itemB: TestItem = {id: 'item_B'};
  const itemC: TestItem = {id: 'item_C'};
  const itemD: TestItem = {id: 'item_D'};
  const itemE: TestItem = {id: 'item_E'};
  const itemList: TestItem[] = [itemA, itemB, itemC, itemD, itemE];

  let model: ItemSelectionModel<TestItem>;
  beforeEach(() => {
    model = new ItemSelectionModel<TestItem>(itemList, 'id', new SelectionModel<TestItem>(true));
  });

  describe('set focusedItem()', () => {
    it('should set focused item and emit change', (done) => {
      model.focusChange$.subscribe((focusedItem: TestItem) => {
        expect(focusedItem).toEqual(itemA);
        done();
      });
      model.focusedItem = itemA;
      expect(model.focusedItem).toEqual(itemA);
    });

    it('should not emit change when same item was set again', () => {
      model.focusedItem = itemA;
      expect(model.focusedItem).toEqual(itemA);
      let dataEmitted;
      model.focusChange$.subscribe(data => dataEmitted = data);
      model.focusedItem = itemA; // same item set again should not emit
      expect(dataEmitted).toBeUndefined();
    });
  });

  describe('selectItem()', () => {
    it('should select and focus single item and emit change when clearOthers=true', (done) => {
      let callCount = 0;
      model.selectionChange$.subscribe((change: ItemSelectionChange<TestItem>) => {
        callCount++;
        if (callCount === 1) {
          expect(change.selectedItems.length).toEqual(1);
          expect(change.addedItems.length).toEqual(1);
          expect(change.addedItems[0]).toEqual(itemA);
          expect(change.removedItems.length).toEqual(0);
          expect(change.focusedItem).toEqual(itemA);
        } else if (callCount === 2) {
          expect(change.selectedItems.length).toEqual(1);
          expect(change.addedItems.length).toEqual(1);
          expect(change.addedItems[0]).toEqual(itemB);
          expect(change.removedItems.length).toEqual(1);
          expect(change.removedItems[0]).toEqual(itemA);
          expect(change.focusedItem).toEqual(itemB);
          done();
        } else {
          fail('called too often');
        }
      });
      model.selectItem(itemA, true);
      expect(model.focusedItem).toEqual(itemA);
      model.selectItem(itemB, true);
      expect(model.focusedItem).toEqual(itemB);
    });

    it('should select multiple items and emit change when clearOthers=false', (done) => {
      let callCount = 0;
      model.selectionChange$.subscribe((change: ItemSelectionChange<TestItem>) => {
        callCount++;
        if (callCount === 1) {
          expect(change.selectedItems.length).toEqual(1);
          expect(change.addedItems.length).toEqual(1);
          expect(change.addedItems[0]).toEqual(itemA);
          expect(change.removedItems.length).toEqual(0);
          expect(change.focusedItem).toEqual(itemA);
        } else if (callCount === 2) {
          expect(change.selectedItems.length).toEqual(2);
          expect(change.addedItems.length).toEqual(1);
          expect(change.addedItems[0]).toEqual(itemB);
          expect(change.removedItems.length).toEqual(0);
          expect(change.focusedItem).toEqual(itemB);
          done();
        } else {
          fail('called too often');
        }
      });
      model.selectItem(itemA, false);
      expect(model.focusedItem).toEqual(itemA);
      model.selectItem(itemB, false);
      expect(model.focusedItem).toEqual(itemB);
    });
  });

});
