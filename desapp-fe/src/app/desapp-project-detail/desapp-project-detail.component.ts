import { state } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { formatMoneyAmount } from '../format-utils/desapp-money-format';

import { Donation } from '../models/Donation';
import { LocationDesApp } from '../models/LocationDesApp';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { DesappDonationDialogComponent } from '../desapp-donation-dialog/desapp-donation-dialog.component';
import { AuthService } from '@auth0/auth0-angular';

export interface ProjectDetailItem extends Project {
  missingPercentage: string;
}

export interface DialogData {
  projectName: string;
  projectId: string;
  donationAmount: number;
  donationComment: string;
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
  donations$ = new BehaviorSubject<Donation[]>([]);
  displayedColumns$ = of(['nickname', 'date', 'amount', 'comment']);

  cards$: Observable<any>;
  project: Project;

  constructor(
    private route: ActivatedRoute,
    private desappApis: DesappBeApisService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id');
      this.project$ = this.desappApis.getProject(id).pipe(
        tap((project) => console.log('PROJECT: ', project)),
        tap((project) => this.donations$.next(this.getAllUsersDonations(project.users))),
        // catchError(() => of({})), // TODO: Aca deberia mostrar un dialog o un alert que indique que fallo el request.
        finalize(() => console.log('pasar loading del spinner a false')), // TODO: spinner con loading.
        map((project) => {
          return {
            ...project,
            raisedFunds: formatMoneyAmount(project.raisedFunds),
            missingPercentage: this.calcularPorcentajeFaltante(project), // TODO: esto deberia venir directamente del BE.
          };
        })
      );

      this.cards$ = combineLatest([this.breakpointObserver.observe(Breakpoints.Handset), this.project$]).pipe(
        tap(([_, project]) => {
          this.project = project;
        }),
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

  calcularPorcentajeFaltante(project: Project): string {
    const maximoRequerido = project.location.population * project.factor;
    const cantidadNecesaria = (maximoRequerido * project.minClosePercentage) / 100;
    const procentajeAcumuladoParaCantNecesaria = (+project.raisedFunds / cantidadNecesaria) * 100;
    const resultado = 100 - procentajeAcumuladoParaCantNecesaria;
    return `${resultado.toFixed(2)} %`;
  }

  openDonationDialog(event): void {
    console.log('event: ', event);
    console.log('project: ', this.project);
    const dialogRef = this.dialog.open(DesappDonationDialogComponent, {
      data: {
        projectName: this.project.name,
        projectId: this.project.id,
        donationAmount: 0,
        donationComment: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log('reulstadoo: ', result);
      if (result !== undefined && result.amount > 0) {
        this.auth.user$.pipe(switchMap((user) => this.desappApis.getUserByMail(user.email))).subscribe((userBE) => {
          this.desappApis.donate({
            projectId: this.project.id,
            userId: userBE.id,
            amount: result.amount,
            comment: result.comment,
          });
        });
      }
      // console.log('this.donationAmount: ', this.donationAmount);
      // console.log('this.donationComment: ', this.donationComment);
      // this.animal = result;
    });
  }

  connectProject(): void {
    console.log('projectId: ', this.project.id);
    this.desappApis
      .connectProject(this.project.id)
      .pipe(
        catchError((err) => {
          console.error('connect project error: ', err);
          return of(null);
        })
      )
      .subscribe((res) => {
        // TODO: mostrar mensaje de exito (en snackbar idealmente)
        console.log('connected project response: ', res);
        this.router.navigate(['']);
      });
  }

  getAllUsersDonations(users: User[]): Donation[] {
    // TODO: Aca estoy mostrando todas las donaciones de los usuarios que donaron a este proyecto, necesito una forma de vincular "proyecto" con "donacion" y tiene que ser desde el BE, al menos q me pase un id de algun de los 2.
    const donations = users.reduce((donationsAccum, userActual) => donationsAccum.concat(userActual.donations), []);
    return donations;
  }
}

////////////////////////////////////////////////////////////
