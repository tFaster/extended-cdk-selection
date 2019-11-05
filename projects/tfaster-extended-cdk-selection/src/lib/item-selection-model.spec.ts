import { ItemSelectionModel } from './item-selection-model';


describe('ItemSelectionModel', () => {
  beforeEach(() => {
  });

  it('should be created', () => {
    const model: ItemSelectionModel<any> = new ItemSelectionModel<any>([]);
    expect(model).toBeTruthy();
  });
});
