import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
}
