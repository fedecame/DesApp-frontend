import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';
import { User } from '../models/User';

@Component({
  selector: 'app-desapp-profile',
  templateUrl: './desapp-profile.component.html',
  styleUrls: ['./desapp-profile.component.scss'],
})
export class DesappProfileComponent implements OnInit {
  user$: Observable<User>;
  cards$: Observable<any>;

  constructor(private breakpointObserver: BreakpointObserver, private desappApis: DesappBeApisService) {}

  ngOnInit(): void {
    this.user$ = this.desappApis.getUser(1);

    this.cards$ = combineLatest([this.breakpointObserver.observe(Breakpoints.Handset), this.user$]).pipe(
      map(([{ matches }, user]) => {
        if (matches) {
          return [
            {
              title: 'User Profile',
              fields: [
                { label: 'Username', value: user.username },
                { label: 'Nickname', value: user.nickname },
                { label: 'Email', value: user.email },
                { label: 'Points', value: user.points },
              ],
              cols: 2,
              rows: 1,
            },
          ];
        }

        return [
          {
            title: 'User Profile',
            fields: [
              { label: 'Username', value: user.username },
              { label: 'Nickname', value: user.nickname },
              { label: 'Email', value: user.email },
              { label: 'Points', value: user.points },
            ],
            cols: 2,
            rows: 1,
          },
        ];
      })
    );
  }

  openChangePassDialog(): void {
    console.log('Mostrar Dialog/Form para cambiar password (3 inputs, 1 para el viejo pass y 2 para el nuevo)');
  }
}
