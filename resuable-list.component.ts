import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import {
  ITDataGridSystem,
  ITDataSourceList,
  ITDataSourceType,
} from '../allTypes';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-reusable-list',
  templateUrl: './reusable-list.component.html',
  styleUrls: ['./reusable-list.component.scss'],
  providers: [EmployeeService],
})
export class ReusableListComponent implements OnInit {
  @ViewChild(DxDataGridComponent, {
    static: false,
  })
  dataGrid!: DxDataGridComponent;

  @Input() filterValue = [];
  gridFilterValue: any;
  groupIndex: number = 0;
  popupPosition: any;
  currentColor: string = '#f05b41';
  currentColorText: string = 'white';

  @Input() customisationOfGrid = {
    gridBackgroundColor: 'yellow',
    gridTextColor: 'black',
    highlightedColumnName: 'id',
  };

  @Input() getColumns: string[] = [];
  @Input() gridConfigs: ITDataGridSystem = {
    enableEditing: true,
    enableSearchPanel: true,
    page: [5, 10],
    pageSize: 5,
  };
  @Input() listData!: ITDataSourceType | ITDataSourceList | any;
  @Input() value: string = 'DataGrid';
  updatedColumns: any = [];

  @Input() groupIndexColumnName: string = '';

  ngOnInit(): void {
    this.restoreGridState(); // Restore formatting settings on initialization
    
  }

  onCellPrepared(e: any) {
    if (e.rowType === 'data') {
      if (
        e.column.dataField === this.customisationOfGrid.highlightedColumnName
      ) {
        e.cellElement.style.backgroundColor = this.currentColor;
        e.cellElement.style.color = this.currentColorText;
        this.saveGridState(); // Save formatting settings
      }
    }
  }

  saveGridState() {
    if (this.dataGrid) {
      const gridState = this.dataGrid.instance.state() || {};
      gridState.customization = {
        backgroundColor: this.currentColor,
        textColor: this.currentColorText,
      };
      localStorage.setItem('gridState', JSON.stringify(gridState));
    }
  }

  restoreGridState() {
    const savedState = localStorage.getItem('gridState');
    if (this.dataGrid && savedState) {
      const gridState = JSON.parse(savedState);
      const customization = gridState.customization;
      if (customization) {
        this.currentColor = customization.backgroundColor;
        this.currentColorText = customization.textColor;
      }
      this.dataGrid.instance.state(gridState);
    }
  }
}
