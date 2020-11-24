import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Project } from '../models/Project';
import { User } from '../models/User';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DesappBeApisService {
  // BASE_URL = env.dev.apiUrl;
  BASE_URL = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  getAllProjects() {
    return this.http.get<Project[]>(`${this.BASE_URL}/projects`);
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
          return projectEndDate.getFullYear() === today.getFullYear() && projectEndDate.getMonth() === today.getMonth();
        })
      )
    );
  }

  getProject(projectId: number) {
    return this.http.get<Project>(`${this.BASE_URL}/projects/${projectId}`);
  }

  donate(reqData: { projectId: number; userId: number; amount: number; comment: string }) {
    return this.http
      .post(`${this.BASE_URL}/donations/project/${reqData.projectId}/user/${reqData.userId}`, {
        amount: reqData.amount,
        comment: reqData.comment,
      })
      .subscribe();
  }

  postLoginWithMail(email: string) {
    return this.http.post(`${this.BASE_URL}/login`, {
      email,
    });
  }

  getUserByMail(email: string) {
    return this.http.get<User>(`${this.BASE_URL}/users/${email}`);
  }

  loginValidateWithBE() {
    return this.http.get<string>(`${this.BASE_URL}/login`);
  }

  createOrUpdateUserInBE({ username, email, nickname }) {
    // TODO: modificar endpoint en BE para que no pida password ni points.
    // Ya no tiene sentido el password en el BE directamente.
    return this.http.post(`${this.BASE_URL}/update_user`, {
      username,
      email,
      nickname,
      password: '',
      points: 0,
    });
  }

  suspendProject(projectId: number) {
    return this.http.put(`${this.BASE_URL}/projects/${projectId}/state/3`, {});
  }

  connectProject(projectId: number) {
    // return this.http.put(`${this.BASE_URL}/projects/${projectId}/state/2`, {});
    return this.http.post<string>(`${this.BASE_URL}/project_state`, {
      projectId,
      stateId: 2,
    });
  }
}
