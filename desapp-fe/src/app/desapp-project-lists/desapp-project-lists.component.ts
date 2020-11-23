import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';
import { DesappCheckUserStatusService } from '../auth-utils/desapp-check-user-status.service';
import { Project } from '../models/Project';

@Component({
  selector: 'app-desapp-project-lists',
  templateUrl: './desapp-project-lists.component.html',
  styleUrls: ['./desapp-project-lists.component.scss'],
})
export class DesappProjectListsComponent implements OnInit {
  openProjects$: Observable<Project[]>;
  runningOutProjects$: Observable<Project[]>;

  constructor(
    private desappApiService: DesappBeApisService,
    public auth: AuthService,
    private desappUserStatusService: DesappCheckUserStatusService
  ) {}

  ngOnInit(): void {
    this.desappUserStatusService.redirectForUserDataIfNeeded();
    this.openProjects$ = this.desappApiService.getOpenProjects();
    this.runningOutProjects$ = this.desappApiService.getRunningOutProjects();
  }
}
