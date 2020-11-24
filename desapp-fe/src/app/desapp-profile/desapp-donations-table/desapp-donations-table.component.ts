import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { Donation } from 'src/app/models/Donation';
import { DesappDonationsTableDataSource } from './desapp-donations-table-datasource';

@Component({
  selector: 'app-desapp-donations-table',
  templateUrl: './desapp-donations-table.component.html',
  styleUrls: ['./desapp-donations-table.component.scss'],
})
export class DesappDonationsTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() title = 'Donations';
  @Input() donations$: Observable<Donation[]> = of([]);
  @Input() displayedColumns$: Observable<string[]> = of([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Donation>;
  dataSource: DesappDonationsTableDataSource;

  // displayedColumns = ['amount', 'date', 'comment'];

  constructor() {}

  ngOnInit(): void {
    this.dataSource = new DesappDonationsTableDataSource(this.donations$);
    this.dataSource.getDonationsTI();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    this.paginator.page.subscribe(() => this.dataSource.getDonationsTI());
    this.sort.sortChange.subscribe(() => this.dataSource.getDonationsTI());
  }

  ngOnDestroy() {
    this.paginator.page.unsubscribe();
    this.sort.sortChange.unsubscribe();
  }
}
