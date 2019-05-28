import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AppComponent } from 'src/app/app.component';
import { ActorListComponent } from '../actor-list/actor-list.component';
import { TripDisplayComponent } from '../../trip/trip-display/trip-display.component';
import { RegisterComponent } from '../../security/register/register.component';
import { LoginComponent } from '../../security/login/login.component';
import { HeaderComponent } from '../../master/header/header.component';
import { MessageComponent } from '../../master/message/message.component';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { FooterComponent } from '../../master/footer/footer.component';
import { HomeComponent } from '../../shared/home/home.component';
import { TripEditComponent } from '../../trip/trip-edit/trip-edit.component';
import { LocalizedDataPipe } from '../../shared/localized-data.pipe';
import { DashboardComponent } from '../../dashboard/dashboard/dashboard.component';
import { ApplicationListComponent } from '../../application/application-list/application-list/application-list.component';
import { ApplicationDisplayComponent } from '../../application/application-display/application-display/application-display.component';
import { TermAndConditionsComponent } from '../../master/terms-and-conditions/term-and-conditions/term-and-conditions.component';
import { NotFoundComponent } from '../../shared/not-found/not-found.component';
import { DeniedAccessPageComponent } from '../../shared/denied-access-page/denied-access-page.component';
import { routes } from 'src/app/app.routes';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig, HttpLoaderFactory } from 'src/app/app.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { APP_BASE_HREF } from '@angular/common';
import { AngularFireAuth } from 'angularfire2/auth';
import { MessageService } from 'src/app/services/message.service';
import { TripService } from 'src/app/services/trip.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TripListComponent } from '../../trip/trip-list/trip-list.component';
import { TripCreateComponent } from '../../trip/trip-create/trip-create.component';
import { ApplicationCreateComponent } from '../../application/application-create/application-create.component';
import { AgmCoreModule } from '@agm/core';
import { ActorService } from 'src/app/services/actor.service';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRouteStub } from '../../application/application-list/application-list/application-list.component.spec';
import { SearchTripComponent } from '../../search-trip/search-trip.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { CheckoutComponent } from '../../checkout/checkout.component';
import { RegisterManagerComponent } from '../../security/register-manager/register-manager.component';
import { ApplicationUpdateComponent } from '../../application/application-update/application-update.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockActivatedRoute;

  beforeEach(async(() => {
    mockActivatedRoute = new ActivatedRouteStub();

      TestBed.configureTestingModule({
        declarations: [
          AppComponent,
          ActorListComponent,
          TripListComponent,
          RegisterComponent,
          LoginComponent,
          HeaderComponent,
          MessageComponent,
          TranslatableComponent,
          FooterComponent,
          HomeComponent,
          TripDisplayComponent,
          TripEditComponent,
          LocalizedDataPipe,
          DashboardComponent,
          ApplicationListComponent,
          ApplicationDisplayComponent,
          TermAndConditionsComponent,
          NotFoundComponent,
          DeniedAccessPageComponent,
          ProfileComponent,
          TripCreateComponent,
          ApplicationCreateComponent,
          SearchTripComponent,
          CheckoutComponent,
          RegisterManagerComponent,
          ApplicationUpdateComponent
        ],
        imports: [
          routes,
          HttpModule,
          BrowserModule,
          FormsModule,
          HttpClientModule,
          ReactiveFormsModule,
          NgxPayPalModule,
          AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC4ay9WI4sdQEmDnjdnjAKx56_l_vVEqsw',
            libraries: ['places']
            }),
          AngularFireModule.initializeApp(firebaseConfig),
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          })
        ],
        providers: [{provide: APP_BASE_HREF, useValue : '/' }, {provide: ActivatedRoute, useValue: mockActivatedRoute},
        AngularFireAuth, MessageService, AngularFireAuth, ActorService, CookieService]
      })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be create', () => {
    expect(component).toBeTruthy();
  });
});
