import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';
import { DesappCheckUserStatusService } from '../auth-utils/desapp-check-user-status.service';
import { Project } from '../models/Project';

@Component({
  selector: 'app-desapp-project-lists',
  templateUrl: './desapp-project-lists.component.html',
  styleUrls: ['./desapp-project-lists.component.scss'],
})
export class DesappProjectListsComponent implements OnInit, OnDestroy {
  openProjects$ = new BehaviorSubject<Project[]>([]);
  runningOutProjects$ = new BehaviorSubject<Project[]>([]);

  constructor(
    private desappApiService: DesappBeApisService,
    public auth: AuthService,
    private desappUserStatusService: DesappCheckUserStatusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.isLoading$.pipe(filter((isLoading) => isLoading)).subscribe((isLoading) => {
      console.log('isLoading: ', isLoading);
      localStorage.removeItem('https://desappfe.com/user_updated');
    });
    this.desappUserStatusService.redirectForUserDataIfNeeded();
    this.desappUserStatusService.isUserDataIncomplete$.subscribe((isUserIncomplete) => {
      if (isUserIncomplete) {
        this.router.navigate(['/complete_missing_user_data']);
      } else {
        localStorage.setItem('https://desappfe.com/user_updated', 'ok');
        // this.openProjects$ = this.desappApiService.getOpenProjects();
        // this.runningOutProjects$ = this.desappApiService.getRunningOutProjects();

        this.desappApiService.getOpenProjects().subscribe((projects) => {
          this.openProjects$.next(projects);
        });
        this.desappApiService.getRunningOutProjects().subscribe((projects) => {
          this.runningOutProjects$.next(projects);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.desappUserStatusService.unsubsribeAll();
  }
}
