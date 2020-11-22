import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DesappFormComponent } from './desapp-form/desapp-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { DesappNavComponent } from './desapp-nav/desapp-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DesappTableComponent } from './desapp-table/desapp-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DesappDashboardComponent } from './desapp-dashboard/desapp-dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DesappProjectListsComponent } from './desapp-project-lists/desapp-project-lists.component';
import { DesappProjectDetailComponent } from './desapp-project-detail/desapp-project-detail.component';
import { DesappNavLayoutComponent } from './desapp-nav-layout/desapp-nav-layout.component';
import { DesappLoginComponent } from './desapp-login/desapp-login.component';
import { DesappRegisterComponent } from './desapp-register/desapp-register.component';
import { DesappPageNotFoundComponent } from './desapp-page-not-found/desapp-page-not-found.component';
import { DesappProfileComponent } from './desapp-profile/desapp-profile.component';
import { DesappDonationDialogComponent } from './desapp-donation-dialog/desapp-donation-dialog.component';
import { DesappOnlyNumbersDirective } from './desapp-only-numbers.directive';
import { DesappUserTableComponent } from './desapp-user-table/desapp-user-table.component';

// Import the module from the SDK
import { AuthModule, AuthHttpInterceptor, HttpMethod } from '@auth0/auth0-angular';
import { environment as env } from '../environments/environment';
import { AuthButtonComponent } from './auth-button/auth-button.component';

@NgModule({
  declarations: [
    AppComponent,
    DesappFormComponent,
    DesappNavComponent,
    DesappTableComponent,
    DesappDashboardComponent,
    DesappProjectListsComponent,
    DesappProjectDetailComponent,
    DesappNavLayoutComponent,
    DesappLoginComponent,
    DesappRegisterComponent,
    DesappPageNotFoundComponent,
    DesappProfileComponent,
    DesappDonationDialogComponent,
    DesappOnlyNumbersDirective,
    DesappUserTableComponent,
    AuthButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatMenuModule,
    HttpClientModule,
    FontAwesomeModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-lyitcq2e.us.auth0.com',
      clientId: '3etdg1cgh46Nfa3Fyw9jE4N3Vuqlgys8',
      audience: 'http://localhost:8090',
      httpInterceptor: {
        allowedList: [
          {
            uri: 'http://localhost:8090/*',
            tokenOptions: {
              audience: 'http://localhost:8090',
            },
          },
          // {
          //   uri: `${env.dev.apiUrl}/projects/*`,
          //   httpMethod: HttpMethod.Get,
          //   tokenOptions: {
          //     audience: env.auth.audience,
          //   },
          // },
          // {
          //   uri: `${env.dev.apiUrl}/projects/*`,
          //   httpMethod: HttpMethod.Delete,
          //   tokenOptions: {
          //     audience: env.auth.audience,
          //     scope: 'delete:project',
          //   },
          // },
          // {
          //   uri: `${env.dev.apiUrl}/projects/*`,
          //   httpMethod: HttpMethod.Post,
          //   tokenOptions: {
          //     audience: env.auth.audience,
          //     scope: 'write:project',
          //   },
          // },
          // {
          //   uri: `${env.dev.apiUrl}/projects/*`,
          //   httpMethod: HttpMethod.Put,
          //   tokenOptions: {
          //     audience: env.auth.audience,
          //     scope: 'write:project',
          //   },
          // },
          // {
          //   uri: `${env.dev.apiUrl}/users/*`,
          //   tokenOptions: {
          //     audience: env.auth.audience,
          //   },
          // },
          // {
          //   uri: `${env.dev.apiUrl}/donations/*`,
          //   tokenOptions: {
          //     audience: env.auth.audience,
          //   },
          // },
          // {
          //   uri: `${env.dev.apiUrl}/login`,
          //   tokenOptions: {
          //     audience: env.auth.audience,
          //   },
          // },
        ],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
