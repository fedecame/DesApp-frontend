import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, combineLatest, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';

@Injectable({
  providedIn: 'root',
})
export class DesappCheckUserStatusService {
  private subscriptions: Subscription[] = [];
  // public isUserDataIncomplete$ = new BehaviorSubject<boolean>(true);
  public isUserDataIncomplete$: Observable<boolean>;
  constructor(private desappApiService: DesappBeApisService, public auth: AuthService, private router: Router) {
    // this.subscriptions.push(
    this.isUserDataIncomplete$ = this.auth.user$.pipe(
      // TODO (posible mejora): si armo un endpoint de "getUser" que no pida el mail, refactorizar esto..no necesitaria armar una "tupla"
      map((user) => !user.email || !user['https://desappfe.com/username'] || !user['https://desappfe.com/nickname'])

      // map((user) => [
      //   !localStorage.getItem('https://desappfe.com/user_updated') || user['https://desappfe.com/is_new'],
      //   user,
      // ]),
      // switchMap(([isUserIncomplete, user]) =>
      //   isUserIncomplete
      //     ? this.desappApiService.getUserByMail(user.email).pipe(
      //         catchError((error) => {
      //           console.error(error);
      //           return of(null);
      //         }),
      //         map((userBE) => userBE === null)
      //       )
      //     : of(false)
      // )
    );
    // .subscribe((isIncomplete) => {
    //   this.isUserDataIncomplete$.next(isIncomplete);
    // })

    // subscribe((user) => {
    //   const isUserIncomplete =
    //     !localStorage.getItem('https://desappfe.com/user_updated') || user['https://desappfe.com/is_new'];

    //   this.isUserDataIncomplete$.next(isUserIncomplete);
    // })
    // );
  }

  redirectForUserDataIfNeeded(): void {
    this.subscriptions.push(
      this.isUserDataIncomplete$.subscribe((isUserIncomplete) => {
        if (isUserIncomplete) {
          this.router.navigate(['/complete_missing_user_data']);
        } else {
          localStorage.setItem('https://desappfe.com/user_updated', 'ok');
        }
      })
    );
    // this.subscriptions.push(
    //   combineLatest([this.isUserDataIncomplete$, this.auth.user$]).subscribe(([isUserComplete, user]) => {
    //     if (isUserComplete) {
    //       //TODO: Cambiar el "getUserByMail" porque deberia poder acceder al mail desde el accessToken. (si tengo q usar /userinfo, dejar asi como esta)
    //       this.desappApiService
    //         .getUserByMail(user.email)
    //         .pipe(
    //           catchError((error) => {
    //             console.error(error);
    //             return of(null);
    //           })
    //         )
    //         .subscribe((usuarioBE) => {
    //           console.log('usuario por mail: ', usuarioBE);
    //           if (usuarioBE) {
    //             localStorage.setItem('https://desappfe.com/user_updated', 'ok');
    //             return;
    //           }
    //           this.router.navigate(['/complete_missing_user_data']);
    //         });
    //     } else {
    //       console.log('user is old');
    //       localStorage.setItem('https://desappfe.com/user_updated', 'ok');
    //     }
    //   })
    // );

    // this.subscriptions.push(this.userData$.subscribe((user) => {
    //   if (!localStorage.getItem('https://desappfe.com/user_updated') || user['https://desappfe.com/is_new']) {
    //     //TODO: request al BE que pide el usuario por mail (que ahora viaja en el accesstoken, que tmb lo puedo obtener con /userinfo desde el BE)
    //     // si el BE me retorna el usuario, no hago nada, en caso contrario redirijo a pagina de completar datos.
    //     // TODO: importante recordar setear en localstorage el item de "user_updated" cuando llegue la respuesta 201 desde el post del submitForm.
    //     console.log('user is neeewww');
    //     // this.desappApiService.getUserByMail(paismariano@gmail.com');
    //     this.desappApiService
    //       .getUserByMail(user.email)
    //       .pipe(
    //         catchError((error) => {
    //           console.error(error);
    //           return of(null);
    //         })
    //       )
    //       .subscribe((usuario) => {
    //         console.log('usuario por mail: ', usuario);
    //         if (usuario) {
    //           localStorage.setItem('https://desappfe.com/user_updated', 'ok');
    //           return;
    //         } else {
    //           this.router.navigate(['/complete_missing_user_data']);
    //         }
    //       });
    //   } else {
    //     console.log('user is old');
    //     localStorage.setItem('https://desappfe.com/user_updated', 'ok');
    //   }
    //   console.log('user data: ', user);
    // }));
  }

  unsubsribeAll(): void {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }
}
