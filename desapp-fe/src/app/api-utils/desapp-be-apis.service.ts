import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Project } from '../models/Project';

@Injectable({
  providedIn: 'root',
})
export class DesappBeApisService {
  BASE_URL = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  getAllProjects() {
    return this.http.get<Project[]>(`${this.BASE_URL}/projects/`);
  }

  getOpenProjects() {
    // TODO: Cuando este implementado el endpoint en BE, cambiar este código para consumirlo directamente.
    return this.getAllProjects().pipe(
      map((projects) => projects.filter((project) => project.state === 'En Planificacion'))
    );
  }

  getRunningOutProjects() {
    // TODO: Usar un endpoint al que se le pasa un queryParam de "end_date" por ejemplo para no traerme todos y filtrarlos aca.
    return this.getOpenProjects().pipe(
      map((projects) =>
        projects.filter((project) => {
          const projectEndDate = new Date(project.endDate);
          const today = new Date();
          return projectEndDate.getFullYear === today.getFullYear && projectEndDate.getMonth === today.getMonth;
        })
      )
    );
  }

  getProject(projectId: number) {
    return this.http.get<Project>(`${this.BASE_URL}/projects/${projectId}`);
  }
}
