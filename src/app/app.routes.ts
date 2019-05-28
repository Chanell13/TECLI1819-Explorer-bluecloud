import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/security/register/register.component';
import { ModuleWithProviders } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/security/login/login.component';
import { HomeComponent } from './components/shared/home/home.component';
import { TripListComponent } from './components/trip/trip-list/trip-list.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { ApplicationListComponent } from './components/application/application-list/application-list/application-list.component';
import { ApplicationDisplayComponent } from './components/application/application-display/application-display/application-display.component';
import { TripDisplayComponent } from './components/trip/trip-display/trip-display.component';
import { TermAndConditionsComponent } from './components/master/terms-and-conditions/term-and-conditions/term-and-conditions.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { ActorRoleGuard } from './guards/actor-role.guard';
import { DeniedAccessPageComponent } from './components/shared/denied-access-page/denied-access-page.component';
import { ProfileComponent } from './components/actor/profile/profile.component';
import { TripCreateComponent } from './components/trip/trip-create/trip-create.component';
import { ApplicationCreateComponent } from './components/application/application-create/application-create.component';
import { SearchTripComponent } from './components/search-trip/search-trip.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ActorListComponent } from './components/actor/actor-list/actor-list.component';
import { RegisterManagerComponent } from './components/security/register-manager/register-manager.component';
import { ApplicationUpdateComponent } from './components/application/application-update/application-update.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'Administrator|Explorer|Manager' }},
  { path: 'login', component: LoginComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'anonymous' }},
  { path: 'register', component: RegisterComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'anonymous|Administrator' }},
  { path: 'Dashboard', component: DashboardComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'Administrator' }},
  { path: 'TripCreateComponent', component: TripCreateComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'Administrator|Manager' }},
  { path: 'Checkout', component: CheckoutComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'Administrator|Explorer|Manager'}},
  { path: 'ActorListComponent' , component: ActorListComponent, canActivate: [ActorRoleGuard], data:{expectedRole:'Administrator|Manager'}},
  { path: 'RegisterManagerComponent', component: RegisterManagerComponent, canActivate: [ActorRoleGuard], data: {expectedRole: 'Administrator'}},
  { path: 'ApplicationUpdateComponent', component: ApplicationUpdateComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'Administrator|Manager'} },
  {
    path: 'trips', children: [
      { path: 'TripDisplay/:id', component: TripDisplayComponent },
      { path: 'SearchTripComponent/:title', component: SearchTripComponent },
      { path: '', component: TripListComponent }
    ]
  },

  {
    path: 'applications', children: [
      { path: 'ApplicationDisplay/:id', component: ApplicationDisplayComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'Administrator|Explorer|Manager' }},
      { path: '', component: ApplicationListComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'Explorer|Manager|Administrator' } }
    ]
  },
  { path: 'ApplicationList', component: ApplicationListComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'Administrator|Explorer|Manager' }},
  { path: 'ApplicationDisplay', component: ApplicationDisplayComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'Administrator|Explorer|Manager' }},
  { path: 'denied-access', component: DeniedAccessPageComponent },
  { path: 'terms-and-conditions', component: TermAndConditionsComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' });
