import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';
import { Project } from '../models/Project';

@Component({
  selector: 'app-desapp-project-lists',
  templateUrl: './desapp-project-lists.component.html',
  styleUrls: ['./desapp-project-lists.component.scss'],
})
export class DesappProjectListsComponent implements OnInit {
  openProjects$: Observable<Project[]>;
  runningOutProjects$: Observable<Project[]>;

  constructor(private desappApiService: DesappBeApisService) {}

  ngOnInit(): void {
    this.openProjects$ = this.desappApiService.getOpenProjects();
    this.runningOutProjects$ = this.desappApiService.getRunningOutProjects();
  }
}
