import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface DesappProjectTableItem {
  name: string;
  participantsAmount: number;
  collectedAmount: number;
  collectedPercentage: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: DesappProjectTableItem[] = [
  { name: 'proyecto1', participantsAmount: 55, collectedAmount: 1350, collectedPercentage: 50.2 },
  { name: 'proyecto2', participantsAmount: 123, collectedAmount: 420, collectedPercentage: 24.6 },
  { name: 'proyecto3', participantsAmount: 7, collectedAmount: 5555, collectedPercentage: 88.9 },
  { name: 'proyecto4', participantsAmount: 0, collectedAmount: 789, collectedPercentage: 6.6 },
  { name: 'proyecto5', participantsAmount: 44, collectedAmount: 678, collectedPercentage: 31.05 },
  { name: 'proyecto6', participantsAmount: 34, collectedAmount: 123, collectedPercentage: 2.4 },
  { name: 'proyecto7', participantsAmount: 69, collectedAmount: 66, collectedPercentage: 5.55 },
];

/**
 * Data source for the DesappTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DesappTableDataSource extends DataSource<DesappProjectTableItem> {
  data: DesappProjectTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DesappProjectTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [observableOf(this.data), this.paginator.page, this.sort.sortChange];

    return merge(...dataMutations).pipe(
      map(() => {
        return this.getPagedData(this.getSortedData([...this.data]));
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DesappProjectTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DesappProjectTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'participants_amount':
          return compare(+a.participantsAmount, +b.participantsAmount, isAsc);
        case 'collected_amount':
          return compare(+a.collectedAmount, +b.collectedAmount, isAsc);
        case 'collected_percentage':
          return compare(+a.collectedPercentage, +b.collectedPercentage, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
