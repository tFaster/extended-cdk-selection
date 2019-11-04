import { Component, OnInit } from '@angular/core';
import { ItemSelectionController } from '../../../tfaster-extended-cdk-selection/src/lib/item-selection-controller';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: MatTableDataSource<PeriodicElement>;

  private selectionController: ItemSelectionController<PeriodicElement>;

  constructor() {
    this.selectionController = new ItemSelectionController<PeriodicElement>([], 'name');
  }

  public ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const loadedData: PeriodicElement[]  = [
      {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
      {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
      {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
      {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
      {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
      {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
      {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
      {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
      {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
      {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'}
    ];
    this.dataSource = new MatTableDataSource<PeriodicElement>(loadedData);
    this.selectionController.updateDataSource(this.dataSource.data);
  }

  onTableKeydown(event: KeyboardEvent): void {
    this.selectionController.handleKeyboardEvent(event);
  }

  onItemClick(item: PeriodicElement, event: MouseEvent): void {
    this.selectionController.handleClickEvent(item, event);
  }

  isSelected(item: PeriodicElement): boolean {
    return this.selectionController.selectionModel.isSelected(item);
  }

  isFocused(item: PeriodicElement): boolean {
    return this.selectionController.selectionModel.isFocused(item);
  }

  get numberOfSelectedItems(): number {
    return this.selectionController.selectionModel.selectedItems.length;
  }
}
