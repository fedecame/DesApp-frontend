import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize, map, startWith, tap } from 'rxjs/operators';
import { Observable, of as observableOf, merge, combineLatest, BehaviorSubject, of, Subject } from 'rxjs';
import { Project } from '../models/Project';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';

// TODO: Replace this with your own data model type
export interface ProjectTableItem {
  name: string;
  participantsAmount: number;
  collectedAmount: number;
  collectedPercentage: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: ProjectTableItem[] = [
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
export class DesappTableDataSource extends DataSource<ProjectTableItem> {
  private projectsTISubject = new BehaviorSubject<ProjectTableItem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false); // TODO: Todavia no se esta usando el loading, la idea es poner un spinner mientras se traen los datos del BE.

  loading$ = this.loadingSubject.asObservable();
  projectsTI$ = this.projectsTISubject.asObservable();

  paginator: MatPaginator;
  sort: MatSort;

  constructor(private getProjectsTI$: Observable<ProjectTableItem[]>) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ProjectTableItem[]> {
    return this.projectsTI$.pipe(map((projects) => this.getPagedData(this.getSortedData(projects))));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  getProjectsTIs() {
    this.loadingSubject.next(true);

    this.getProjectsTI$
      .pipe(
        catchError(() => of([])), // TODO: Aca podria mostrar un Dialog o un Alert para indicar que falló el request.
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((projectsTI) => {
        this.projectsTISubject.next([...projectsTI]);
      });
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: ProjectTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ProjectTableItem[]) {
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
