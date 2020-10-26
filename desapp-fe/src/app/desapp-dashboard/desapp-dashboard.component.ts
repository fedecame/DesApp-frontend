import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Project } from '../models/Project';
import { LocationDesApp } from '../models/LocationDesApp';
import { User } from '../models/User';
import { combineLatest, Observable } from 'rxjs';
import { ProjectDetailItem } from '../desapp-project-detail/desapp-project-detail.component';

@Component({
  selector: 'app-desapp-dashboard',
  templateUrl: './desapp-dashboard.component.html',
  styleUrls: ['./desapp-dashboard.component.scss'],
})
export class DesappDashboardComponent implements OnInit {
  @Input() project$: Observable<ProjectDetailItem>;
  @Input() location$: Observable<LocationDesApp>;
  @Input() users$: Observable<User[]>;
  cards$: Observable<any>;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    /** Based on the screen size, switch from standard to one column per row */
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
                { label: 'Name', value: 'Jamaica' },
                { label: 'Population', value: '420' },
                { label: 'Province', value: 'ReggaeMusic' },
              ],
              cols: 2,
              rows: 1,
            },
            { title: 'Donors', fields: [{ label: 'nickname', value: 'rastafa' }], cols: 2, rows: 2 },
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
              { label: 'Name', value: 'Jamaica' },
              { label: 'Population', value: '420' },
              { label: 'Province', value: 'ReggaeMusic' },
            ],
            cols: 1,
            rows: 1,
          },
          { title: 'Donors', cols: 2, rows: 1 },
          // { title: 'Card 4', cols: 1, rows: 1 },
        ];
      })
    );

    this.location$.subscribe();
  }
}
