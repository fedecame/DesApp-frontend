import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';

@Injectable({
  providedIn: 'root',
})
export class DesappCheckUserStatusService {
  constructor(private desappApiService: DesappBeApisService, public auth: AuthService, private router: Router) {}

  redirectForUserDataIfNeeded(): void {
    this.auth.user$.subscribe((user) => {
      if (!localStorage.getItem('https://desappfe.com/user_updated') || user['https://desappfe.com/is_new']) {
        //TODO: request al BE que pide el usuario por mail (que ahora viaja en el accesstoken, que tmb lo puedo obtener con /userinfo desde el BE)
        // si el BE me retorna el usuario, no hago nada, en caso contrario redirijo a pagina de completar datos.
        // TODO: importante recordar setear en localstorage el item de "user_updated" cuando llegue la respuesta 201 desde el post del submitForm.
        console.log('user is neeewww');
        // this.desappApiService.getUserByMail(paismariano@gmail.com');
        this.desappApiService
          .getUserByMail(user.email)
          .pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe((usuario) => {
            console.log('usuario por mail: ', usuario);
            if (usuario) {
              localStorage.setItem('https://desappfe.com/user_updated', 'ok');
              return;
            } else {
              this.router.navigate(['/complete_missing_user_data']);
            }
          });
      } else {
        console.log('user is old');
        localStorage.setItem('https://desappfe.com/user_updated', 'ok');
      }
      console.log('user data: ', user);
    });
  }
}
