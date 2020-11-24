import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';
import { DesappCheckUserStatusService } from '../auth-utils/desapp-check-user-status.service';
import { Donation } from '../models/Donation';
import { FieldConfig } from '../models/FieldConfig';
import { fieldErrorMessages } from '../models/FieldErrorMessages';
import { User } from '../models/User';

@Component({
  selector: 'app-desapp-profile',
  templateUrl: './desapp-profile.component.html',
  styleUrls: ['./desapp-profile.component.scss'],
})
export class DesappProfileComponent implements OnInit, OnDestroy {
  user$ = new BehaviorSubject<User>(null);
  cards$: Observable<any>;
  donations$ = new BehaviorSubject<Donation[]>([]);
  displayedColumns$ = of(['amount', 'date', 'comment']);
  editProfile$ = new BehaviorSubject<boolean>(false);
  editProfileForm$ = new Subject<FormGroup>();

  fieldsConfig: FieldConfig[] = [
    new FieldConfig({
      key: 'username',
      label: 'Username',
      errors: [fieldErrorMessages.required, fieldErrorMessages.minlength, fieldErrorMessages.maxlength],
      options: {
        placeholder: 'Enter your username',
      },
    }),
    new FieldConfig({
      key: 'email',
      label: 'Email',
      errors: [fieldErrorMessages.required],
    }),
    new FieldConfig({
      key: 'nickname',
      label: 'Nickname',
      errors: [fieldErrorMessages.required, fieldErrorMessages.minlength, fieldErrorMessages.maxlength],
      options: {
        placeholder: 'Enter your nickname',
      },
    }),
    new FieldConfig({
      key: 'points',
      label: 'Points',
      errors: [fieldErrorMessages.required],
    }),
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private desappApis: DesappBeApisService,
    public auth: AuthService,
    private desappUserStatusService: DesappCheckUserStatusService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  // TODO: Agregar "subscriptions" y unsubscribe all en el onDestroy.

  ngOnInit(): void {
    // this.user$ = this.desappApis.getUser(1);
    // this.user$ = this.desappApis.getUserByMail('paismariano@gmail.com');
    // this.desappUserStatusService.redirectForUserDataIfNeeded();
    this.desappUserStatusService.isUserDataIncomplete$.subscribe((isUserIncomplete) => {
      if (isUserIncomplete) {
        this.router.navigate(['/complete_missing_user_data']);
      } else {
        let username = '';
        let nickname = '';
        let email = '';
        this.auth.user$
          .pipe(
            tap((user) => {
              username = user['https://desappfe.com/username'];
              nickname = user['https://desappfe.com/nickname'];
              email = user.email;
            }),
            // TODO: Para poder sacar este llamado a "getUserByMail" necesito actualizar los datos de "username" y "nickname" en la base de auth0 ademas de la del BE (seguramente se pueda el nickname con "management APi", pero dudo q se pueda username).
            switchMap((user) => this.desappApis.getUserByMail(user.email))
          )
          .subscribe((userBE) => {
            console.log('userBE: ', userBE);
            if (userBE) {
              this.user$.next(userBE);
              this.donations$.next(userBE.donations);
            } else {
              this.desappApis
                .createOrUpdateUserInBE({
                  nickname,
                  username,
                  email,
                })
                .pipe(
                  catchError((error) => {
                    console.error('user update/create error: ', error);
                    // TODO: Mostrar mensaje de error (en un snackbar o un modal por ej.)
                    return of(null);
                  })
                )
                .subscribe((updatedUser) => {
                  console.log('user updated/created: ', updatedUser);
                  this.user$.next(updatedUser);
                  this.donations$.next(updatedUser.donations);
                });
            }
          });
        localStorage.setItem('https://desappfe.com/user_updated', 'ok');
      }
    });
    // this.user$ = this.auth.user$;
    this.desappApis.loginValidateWithBE().subscribe((response) => console.log('respuesta login: ', response));

    this.user$.pipe(filter((user) => user != null)).subscribe((user) => {
      console.log('user for form creation: ', user);
      this.createEditForm(user);
    });

    this.cards$ = combineLatest([this.breakpointObserver.observe(Breakpoints.Handset), this.user$]).pipe(
      tap(([_, user]) => console.log('USER data: ', user)),
      filter(([_, user]) => !!user),
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

  createEditForm(user: User): void {
    this.editProfileForm$.next(
      this.fb.group({
        username: [
          { value: user.username, disabled: user.username?.length > 0 },
          {
            validators: [Validators.required, Validators.minLength(3), Validators.maxLength(16)],
            updateOn: 'change',
          },
        ],
        email: [
          { value: user.email, disabled: true },
          { validators: [Validators.required], updateOn: 'change' },
        ],
        nickname: [
          user.nickname,
          {
            validators: [Validators.required, Validators.minLength(3), Validators.maxLength(16)],
            updateOn: 'change',
          },
        ],
        points: [
          { value: user.points, disabled: true },
          {
            validators: [Validators.required],
            updateOn: 'change',
          },
        ],
        // password: [null, Validators.required],
      })
    );
  }

  submitEditProfile(formValue) {
    this.desappApis
      .createOrUpdateUserInBE({
        nickname: formValue.nickname,
        username: formValue.username,
        email: formValue.email,
      })
      .pipe(
        catchError((error) => {
          console.error('user update/create error: ', error);
          // TODO: Mostrar mensaje de error (en un snackbar o un modal por ej.)
          return of(null);
        })
      )
      .subscribe((res) => {
        console.log('user updated/created: ', res);
        this.editProfile$.next(false);
      });
  }

  openChangePassDialog(): void {
    console.log('Mostrar Dialog/Form para cambiar password (3 inputs, 1 para el viejo pass y 2 para el nuevo)');
  }

  cancelEditProfile(): void {
    this.editProfile$.next(false);
  }

  openEditProfileForm(): void {
    console.log('abrir form de edición de profile');
    this.editProfile$.next(true);
  }

  ngOnDestroy(): void {
    this.desappUserStatusService.unsubsribeAll();
  }
}
