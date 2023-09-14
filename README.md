# ideal-waddle-dex
just for my readme
html
<h2 class="content-block">{{ value }}</h2>
<dx-data-grid
  [width]="'100%'"
  id="id"
  [dataSource]="listData"
  [rowAlternationEnabled]="true"
>
  <dxo-state-storing
    [enabled]="true"
    type="localStorage"
    storageKey="gridState"
  ></dxo-state-storing>
  <dxo-paging [pageSize]="gridConfigs.pageSize"></dxo-paging>
  <dxo-editing
    [allowUpdating]="gridConfigs.enableEditing"
    [useIcons]="true"
    mode="row"
  ></dxo-editing>

  <dxo-pager
    [showPageSizeSelector]="true"
    [allowedPageSizes]="gridConfigs.page"
  ></dxo-pager>
  <dxo-search-panel
    [visible]="gridConfigs.enableSearchPanel"
    [highlightCaseSensitive]="true"
  ></dxo-search-panel>
  <div *ngFor="let item of getColumns; let i; of: updatedColumns">
    <dxi-column [dataField]="item" [caption]="i"></dxi-column>
  </div>
</dx-data-grid>
//import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EmployeeService } from '../employee.service';
import {
  ITDataGridSystem,
  ITDataSourceList,
  ITDataSourceType,
} from '../allTypes';
import { DxDataGridComponent } from 'devextreme-angular'; // Import DxDataGridComponent

@Component({
  selector: 'app-reusable-list',
  templateUrl: './reusable-list.component.html',
  styleUrls: ['./reusable-list.component.scss'],
  providers: [EmployeeService],
})
export class ReusableListComponent implements OnInit, OnDestroy {
  constructor(public empService: EmployeeService) {}

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent; // Reference to DxDataGridComponent

  @Input() value: string = 'DataGrid';
  @Input() gridConfigs: ITDataGridSystem = {
    enableEditing: true,
    enableSearchPanel: true,
    page: [5, 10],
    pageSize: 5,
  };

  getColumns: any = [];
  updatedColumns: any = [];

  replaceItemInArray(
    givenArray: string[] | number[],
    oldItem: string | number,
    newItem: string | number
  ): string[] | number[] {
    return givenArray.map((item: any) => (item === oldItem ? newItem : item));
  }

  @Input() listData!: ITDataSourceType | ITDataSourceList | any; // Default data

  ngOnInit(): void {
    this.getColumns = Object.keys(this.listData[0]);
    this.updatedColumns = this.replaceItemInArray(
      this.getColumns,
      'credit_card_company',
      'ccc'
    );

    // Restore grid state when the component is initialized
    this.restoreGridState();
  }

  ngOnDestroy(): void {
    // Save grid state when the component is destroyed
    this.saveGridState();
  }

  // Method to save the grid's state to local storage
  saveGridState() {
    if (this.dataGrid) {
      const gridState = this.dataGrid.instance.state();
      localStorage.setItem('gridState', JSON.stringify(gridState));
    }
  }

  // Method to restore the grid's state from local storage
  restoreGridState() {
    const savedState = localStorage.getItem('gridState');
    if (this.dataGrid && savedState) {
      this.dataGrid.instance.state(JSON.parse(savedState));
    }
  }
}
//component.ts
