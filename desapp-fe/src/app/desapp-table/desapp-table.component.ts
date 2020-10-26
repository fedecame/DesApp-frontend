import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';
import { Project } from '../models/Project';
import { DesappTableDataSource, ProjectTableItem } from './desapp-table-datasource';

@Component({
  selector: 'app-desapp-table',
  templateUrl: './desapp-table.component.html',
  styleUrls: ['./desapp-table.component.scss'],
})
export class DesappTableComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() title = 'Projects';
  @Input() projects$: Observable<Project[]> = this.desapApiService.getAllProjects();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ProjectTableItem>;
  dataSource: DesappTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'participants_amount', 'collected_amount', 'collected_percentage'];

  constructor(private desapApiService: DesappBeApisService) {}

  ngOnInit() {
    this.dataSource = new DesappTableDataSource(
      this.projects$.pipe(
        map((projects) => {
          return projects.map((project) => {
            return {
              id: project.id,
              name: project.name,
              participantsAmount: project.users.length, // TODO: Cambiar esto en lo posible, que el BE me de la cantidad de participantes.
              collectedAmount: project.raisedFunds,
              collectedPercentage: (project.raisedFunds / (project.location.population * project.factor)) * 100, // TODO: IMPORTANTE ver como obtener esto desde el BE, no esta bueno hacer la cuenta en el FE..sino minimamente guardarla en otro lado antes (state management: NgRx D':)
            };
          });
        })
      )
    );
    this.dataSource.getProjectsTIs();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    this.paginator.page.subscribe(() => this.dataSource.getProjectsTIs());
    this.sort.sortChange.subscribe(() => this.dataSource.getProjectsTIs());
  }

  selectProject(event, projectId) {
    console.log('Project selected! Event: ', event);
    console.log('Project extra args: ', projectId);
  }

  ngOnDestroy() {
    this.paginator.page.unsubscribe();
    this.sort.sortChange.unsubscribe();
  }
}
