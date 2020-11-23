import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DesappBeApisService } from '../api-utils/desapp-be-apis.service';
import { FieldConfig } from '../models/FieldConfig';
import { fieldErrorMessages } from '../models/FieldErrorMessages';

@Component({
  selector: 'app-desapp-complete-user-data',
  templateUrl: './desapp-complete-user-data.component.html',
  styleUrls: ['./desapp-complete-user-data.component.scss'],
})
export class DesappCompleteUserDataComponent implements OnInit {
  formGroup = new Subject<FormGroup>();
  username: string;
  email: string;

  // this.fb.group({
  //   username: [
  //     { value: 'asd', disabled: true },
  //     { validators: [Validators.required], updateOn: 'change' },
  //   ],
  //   email: [
  //     { value: '123', disabled: true },
  //     { validators: [Validators.required], updateOn: 'change' },
  //   ],
  //   nickname: [null, { validators: [Validators.required], updateOn: 'change' }],
  //   // password: [null, Validators.required],
  // });

  fieldsConfig: FieldConfig[] = [
    new FieldConfig({
      key: 'username',
      label: 'Username',
      errors: [fieldErrorMessages.required],
    }),
    new FieldConfig({
      key: 'email',
      label: 'Email',
      errors: [fieldErrorMessages.required],
    }),
    new FieldConfig({
      key: 'nickname',
      label: 'Nickname',
      errors: [fieldErrorMessages.required],
      options: {
        placeholder: 'Enter your nickname',
      },
    }),
    // {
    //   key: 'username',
    //   type: 'input',
    //   label: 'Username',
    //   cssClasses: [],
    //   disabled: true,
    // },
    // {
    //   key: 'email',
    //   type: 'input',
    //   label: 'Email',
    //   cssClasses: [],
    //   disabled: true,
    // },
    // {
    //   key: 'nickname',
    //   type: 'input',
    //   label: 'Nickname',
    //   cssClasses: [],
    //   disabled: false,
    // },
  ];

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private desappApis: DesappBeApisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.username = user['https://desappfe.com/username'];
      this.email = user.email;
      console.log('user: ', user);
      this.formGroup.next(
        this.fb.group({
          username: [
            { value: this.username, disabled: true },
            { validators: [Validators.required], updateOn: 'change' },
          ],
          email: [
            { value: this.email, disabled: true },
            { validators: [Validators.required], updateOn: 'change' },
          ],
          nickname: [null, { validators: [Validators.required], updateOn: 'change' }],
          // password: [null, Validators.required],
        })
      );
    });
  }

  onSubmit(formValue) {
    this.desappApis
      .createOrUpdateUserInBE({
        nickname: formValue.nickname,
        username: this.username,
        email: this.email,
      })
      .pipe(
        catchError((error) => {
          console.error('user update/create error: ', error);
          //TODO: Mostrar mensaje de error (en un snackbar o un modal por ej.)
          return of(null);
        })
      )
      .subscribe((res) => {
        console.log('user updated/created: ', res);
        localStorage.setItem('https://desappfe.com/user_updated', 'ok');
        this.router.navigate(['']);
      });
  }
}
