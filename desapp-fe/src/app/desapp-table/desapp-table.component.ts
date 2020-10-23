import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DesappTableDataSource, DesappProjectTableItem } from './desapp-table-datasource';

@Component({
  selector: 'app-desapp-table',
  templateUrl: './desapp-table.component.html',
  styleUrls: ['./desapp-table.component.scss'],
})
export class DesappTableComponent implements AfterViewInit, OnInit {
  @Input() title: string = 'Projects';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<DesappProjectTableItem>;
  dataSource: DesappTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'participants_amount', 'collected_amount', 'collected_percentage'];

  ngOnInit() {
    this.dataSource = new DesappTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  selectProject(event) {
    console.log('Project selected! Event: ', event);
  }
}
