import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-desapp-nav',
  templateUrl: './desapp-nav.component.html',
  styleUrls: ['./desapp-nav.component.scss'],
})
export class DesappNavComponent {
  faUserCircle = faUserCircle;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  constructor(private breakpointObserver: BreakpointObserver, private apiServiceBE: DesappBeApisService) {}

  fetchProjects() {
    this.apiServiceBE.getAllProjects().subscribe((projects) => {
      console.log('All projects: ', projects);
    });
  }

  goToProfile() {
    // TODO: Hacer el ruteo a /profile.
    console.log('Route to /profile');
  }
}
