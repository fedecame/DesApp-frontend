import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';

@Component({
  selector: 'app-desapp-login',
  templateUrl: './desapp-login.component.html',
  styleUrls: ['./desapp-login.component.scss'],
})
export class DesappLoginComponent implements OnInit {
  constructor(public auth: AuthService, private apiServiceBE: DesappBeApisService) {}

  ngOnInit(): void {
    console.log('login component');
    // this.auth.user$.subscribe((user) => {
    //   console.log('USER: ', user);
    //   this.apiServiceBE.postLoginWithMail(user.email);
    // });
  }
}
