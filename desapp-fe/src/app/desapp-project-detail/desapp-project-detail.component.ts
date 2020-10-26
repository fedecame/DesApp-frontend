import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';
import { Donation } from '../models/Donation';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { LocationDesApp } from '../models/LocationDesApp';
import { Project } from '../models/Project';
import { User } from '../models/User';

export interface ProjectDetailItem extends Project {
  missingPercentage: number;
}

@Component({
  selector: 'app-desapp-project-detail',
  templateUrl: './desapp-project-detail.component.html',
  styleUrls: ['./desapp-project-detail.component.scss'],
})
export class DesappProjectDetailComponent implements OnInit {
  project$: Observable<ProjectDetailItem>;
  location$: Observable<LocationDesApp>;
  users$: Observable<User[]>;

  cards$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private desappApis: DesappBeApisService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id');
      this.project$ = this.desappApis.getProject(id).pipe(
        // catchError(() => of({})), // TODO: Aca deberia mostrar un dialog o un alert que indique que fallo el request.
        finalize(() => console.log('pasar loading del spinner a false')), // TODO: spinner con loading.
        map((project) => {
          return {
            ...project,
            missingPercentage: this.calcularPorcentajeFaltante(project),
          };
        })
      );

      this.cards$ = combineLatest([this.breakpointObserver.observe(Breakpoints.Handset), this.project$]).pipe(
        map(([{ matches }, project]) => {
          if (matches) {
            return [
              {
                title: 'Project',
                fields: [
                  { label: 'Name', value: project.name },
                  { label: 'Connectivity', value: project.state },
                  { label: 'Raised Funds', value: project.raisedFunds },
                  { label: 'Missing Percentage', value: project.missingPercentage },
                ],
                cols: 2,
                rows: 1,
              },
              {
                title: 'Location',
                fields: [
                  { label: 'Name', value: project.location.name },
                  { label: 'Population', value: project.location.population },
                  { label: 'Province', value: project.location.province },
                ],
                cols: 2,
                rows: 1,
              },
              // { title: 'Donors', fields: [{ label: 'nickname', value: 'rastafa' }], cols: 2, rows: 2 },
              // { title: 'Card 4', cols: 2, rows: 1 },
            ];
          }

          return [
            {
              title: 'Project',
              fields: [
                { label: 'Name', value: project.name },
                { label: 'Connectivity', value: project.state },
                { label: 'Raised Funds', value: project.raisedFunds },
                { label: 'Missing Percentage', value: project.missingPercentage },
              ],
              cols: 1,
              rows: 1,
            },
            {
              title: 'Location',
              fields: [
                { label: 'Name', value: project.location.name },
                { label: 'Population', value: project.location.population },
                { label: 'Province', value: project.location.province },
              ],
              cols: 1,
              rows: 1,
            },
            // { title: 'Donors', cols: 2, rows: 1 },
            // { title: 'Card 4', cols: 1, rows: 1 },
          ];
        })
      );

      // this.project$.subscribe();
    });
  }

  calcularPorcentajeFaltante(project: Project): number {
    const maximoRequerido = project.location.population * project.factor;
    const cantidadNecesaria = (maximoRequerido * project.minClosePercentage) / 100;
    const procentajeAcumuladoParaCantNecesaria = (project.raisedFunds / cantidadNecesaria) * 100;
    return 100 - procentajeAcumuladoParaCantNecesaria;
  }
}

////////////////////////////////////////////////////////////
