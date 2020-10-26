import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
