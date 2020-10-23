import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DesappBeApisService {
  BASE_URL = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  getAllProjects() {
    return this.http.get(`${this.BASE_URL}/projects/`);
  }
}
