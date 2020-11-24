import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { Donation } from 'src/app/models/Donation';

export class DesappDonationsTableDataSource extends DataSource<Donation> {
  private donationsTISubject = new BehaviorSubject<Donation[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();
  donationsTI$ = this.donationsTISubject.asObservable();

  paginator: MatPaginator;
  sort: MatSort;

  constructor(private getDonationsTI$: Observable<Donation[]>) {
    super();
  }

  connect(): Observable<Donation[]> {
    return this.donationsTI$.pipe(map((donations) => this.getPagedData(this.getSortedData(donations))));
  }

  disconnect() {}

  getDonationsTI() {
    this.loadingSubject.next(true);

    this.getDonationsTI$
      .pipe(
        catchError(() => of([])), // TODO: Aca podria mostrar un Dialog o un Alert para indicar que falló el request.
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((donationsTI) => {
        this.donationsTISubject.next([...donationsTI]);
      });
  }

  private getPagedData(data: Donation[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: Donation[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'amount':
          return compare(+a.amount, +b.amount, isAsc);
        case 'date':
          return compare(new Date(a.date), new Date(b.date), isAsc);
        case 'nickname':
          return compare(a.userNickname, b.userNickname, isAsc);
        case 'comment':
          return compare(a.comment, b.comment, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number | Date, b: string | number | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
